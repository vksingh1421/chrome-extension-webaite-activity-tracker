let websites = {};

chrome.storage.local.get(['trackingEnabled'], (result) => {
  const trackingEnabled = result.trackingEnabled !== false; // Default to true

  if (trackingEnabled) {
    setupListeners();
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.trackingEnabled) {
    const trackingEnabled = changes.trackingEnabled.newValue;
    if (trackingEnabled) {
      setupListeners();
    } else {
      removeListeners();
    }
  }
});

function setupListeners() {
  chrome.webNavigation.onCompleted.addListener(trackWebsite, { url: [{ urlMatches: 'http://*/*' }, { urlMatches: 'https://*/*' }] });
  chrome.tabs.onRemoved.addListener(calculateTimeSpent);
}

function removeListeners() {
  chrome.webNavigation.onCompleted.removeListener(trackWebsite);
  chrome.tabs.onRemoved.removeListener(calculateTimeSpent);
}

function trackWebsite(details) {
  chrome.tabs.get(details.tabId, (tab) => {
    if (tab) {
      const url = new URL(tab.url);
      const domain = url.hostname;
      const startTime = new Date().getTime();

      if (!websites[domain]) {
        websites[domain] = {
          visits: 0,
          timeSpent: 0,
          categories: categorizeWebsite(domain),
          ip: null,
          startTime: startTime
        };
      }

      websites[domain].visits += 1;

      fetch(`https://ipinfo.io/${domain}/json`)
        .then(response => response.json())
        .then(data => {
          websites[domain].ip = data.ip;
          chrome.storage.local.set({ websites });
        })
        .catch(error => console.log("Error fetching IP:", error));
    }
  });
}

function calculateTimeSpent(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (tab) {
      const url = new URL(tab.url);
      const domain = url.hostname;
      const endTime = new Date().getTime();

      if (websites[domain] && websites[domain].startTime) {
        websites[domain].timeSpent += endTime - websites[domain].startTime;
        delete websites[domain].startTime;
        chrome.storage.local.set({ websites });
      }
    }
  });
}

function categorizeWebsite(domain) {
  if (domain.includes('google') || domain.includes('stack')) {
    return 'Productivity';
  } else if (domain.includes('youtube') || domain.includes('netflix')) {
    return 'Entertainment';
  } else if (domain.includes('espn') || domain.includes('sports')) {
    return 'Sports';
  } else if (domain.includes('bbc') || domain.includes('news')) {
    return 'News';
  } else {
    return 'Other';
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getWebsites') {
    chrome.storage.local.get('websites', (result) => {
      sendResponse({ websites: result.websites });
    });
    return true;
  }
});
