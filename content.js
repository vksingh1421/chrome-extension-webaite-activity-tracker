// Function to check if a website is explicit based on domain or content
function isExplicitWebsite(url) {
    const explicitDomains = ['explicitwebsite1.com', 'explicitwebsite2.com']; // Add explicit domains
    const explicitKeywords = ['adult', 'explicit', 'nsfw']; // Add explicit keywords
  
    // Check if the URL contains explicit domain or keywords
    for (const domain of explicitDomains) {
      if (url.includes(domain)) {
        return true;
      }
    }
  
    for (const keyword of explicitKeywords) {
      if (url.toLowerCase().includes(keyword)) {
        return true;
      }
    }
  
    return false;
  }
  
  // Function to recommend watching time based on category
  function recommendWatchingTime(category) {
    switch (category.toLowerCase()) {
      case 'productivity':
        return 'You should spend limited time for work-related browsing to maintain focus.';
      case 'entertainment':
        return 'Enjoy your entertainment, but remember to take breaks for physical and mental health.';
      case 'sports':
        return 'Watching sports is great, but balance it with other activities to stay active.';
      case 'news':
        return 'Stay informed, but be mindful of information overload. Take breaks.';
      default:
        return 'Enjoy your browsing responsibly and take breaks as needed.';
    }
  }
  
  // Function to handle recommendations and warnings
  function handleRecommendationsAndWarnings() {
    const currentURL = window.location.href;
    const category = categorizeWebsite(currentURL);
  
    // Recommendation for watching time
    const watchingTimeRecommendation = recommendWatchingTime(category);
    console.log('Watching Time Recommendation:', watchingTimeRecommendation);
  
    // Warning for explicit websites
    if (isExplicitWebsite(currentURL)) {
      alert('Warning: This website may contain explicit content. Proceed with caution.');
    }
  }
  
  // Categorize website based on URL
  function categorizeWebsite(url) {
    // Modify this function to categorize based on specific criteria or external APIs
    if (url.includes('google') || url.includes('stack')) {
      return 'Productivity';
    } else if (url.includes('youtube') || url.includes('netflix')) {
      return 'Entertainment';
    } else if (url.includes('espn') || url.includes('sports')) {
      return 'Sports';
    } else if (url.includes('bbc') || url.includes('news')) {
      return 'News';
    } else {
      return 'Other';
    }
  }
  
  // Execute recommendations and warnings on page load
  handleRecommendationsAndWarnings();
  