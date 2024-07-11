document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleTracking');
  
    // Load initial state
    chrome.storage.local.get(['trackingEnabled'], (result) => {
      const trackingEnabled = result.trackingEnabled !== false; // Default to true
      updateToggleButton(trackingEnabled);
      if (trackingEnabled) {
        loadWebsites();
      }
    });
  
    toggleButton.addEventListener('click', () => {
      chrome.storage.local.get(['trackingEnabled'], (result) => {
        const trackingEnabled = result.trackingEnabled !== false;
        const newTrackingState = !trackingEnabled;
        chrome.storage.local.set({ trackingEnabled: newTrackingState }, () => {
          updateToggleButton(newTrackingState);
          if (newTrackingState) {
            loadWebsites();
          } else {
            document.getElementById('websites').innerHTML = '';
          }
        });
      });
    });
  
    function updateToggleButton(trackingEnabled) {
      const toggleButton = document.getElementById('toggleTracking');
      if (trackingEnabled) {
        toggleButton.textContent = 'Turn Off Tracking';
        toggleButton.classList.remove('off');
      } else {
        toggleButton.textContent = 'Turn On Tracking';
        toggleButton.classList.add('off');
      }
    }
  
    function loadWebsites() {
      chrome.runtime.sendMessage({ type: 'getWebsites' }, (response) => {
        const websites = response.websites || {};
        const websitesContainer = document.getElementById('websites');
        websitesContainer.innerHTML = '';
      
        for (const [domain, data] of Object.entries(websites)) {
          const websiteDiv = document.createElement('div');
          websiteDiv.className = 'website';
  
          const categorySpan = document.createElement('span');
          categorySpan.className = `category ${data.categories.toLowerCase()}`;
          categorySpan.textContent = `Category: ${data.categories}`;
  
          const ipSpan = document.createElement('span');
          ipSpan.className = 'category';
          ipSpan.textContent = `IP: ${data.ip}`;
  
          websiteDiv.textContent = `${domain} - Visits: ${data.visits}, Time Spent: ${Math.round(data.timeSpent / 1000)}s`;
          websiteDiv.appendChild(document.createElement('br'));
          websiteDiv.appendChild(categorySpan);
          websiteDiv.appendChild(document.createElement('br'));
          websiteDiv.appendChild(ipSpan);
        
          websitesContainer.appendChild(websiteDiv);
        }
      });
    }
  });
  