// Plotted YouTube & YouTube Shorts Content Script
// Captures cinema video essays, film reviews, movie trailers, and YouTube Shorts edits.

(function() {
  let lastCapturedUrl = '';

  function inspectYouTubeContent() {
    const currentUrl = window.location.href;
    const path = window.location.pathname;
    const isShorts = path.startsWith('/shorts');
    const isWatch = path.startsWith('/watch');

    if (!isWatch && !isShorts) return;
    if (currentUrl === lastCapturedUrl) return;

    let title = '';
    let channel = 'YouTube Channel';

    if (isShorts) {
      // 1. YouTube Shorts Reel DOM Extraction
      const activeReel = document.querySelector('ytd-reel-video-renderer[is-active]');
      const titleEl = activeReel 
        ? activeReel.querySelector('#overlay h2, #overlay yt-formatted-string.title, .reel-player-header-view-model h2') 
        : document.querySelector('h2.title, #overlay yt-formatted-string');
      
      const channelEl = activeReel 
        ? activeReel.querySelector('#channel-name a, ytd-channel-name a') 
        : document.querySelector('#channel-name a');

      title = titleEl ? titleEl.textContent.trim() : document.title.replace('- YouTube', '').trim();
      channel = channelEl ? channelEl.textContent.trim() : 'Shorts Creator';

      if (title && title.length > 2) {
        lastCapturedUrl = currentUrl;
        chrome.runtime.sendMessage({
          type: 'PLOTTED_STREAM_DETECTED',
          data: {
            streamType: 'youtube_shorts',
            title: title,
            channel: channel,
            url: currentUrl,
            notes: 'Captured from YouTube Shorts cinema feed / scene breakdown'
          }
        });
      }
      return;
    }

    // 2. Standard YouTube /watch Long-form Extraction
    const titleEl = document.querySelector('h1.ytd-watch-metadata yt-formatted-string, #title h1 yt-formatted-string');
    const channelEl = document.querySelector('#channel-name #text a, ytd-channel-name a');
    
    if (titleEl && titleEl.textContent) {
      title = titleEl.textContent.trim();
      channel = channelEl ? channelEl.textContent.trim() : 'YouTube Channel';

      // Cinema & film interest heuristic
      const filmKeywords = /movie|film|cinema|ending explained|review|scene|trailer|breakdown|director|villeneuve|nolan|tarantino|scorsese|oscar|easter egg|cinematography|sound design|plot twist/i;
      
      if (filmKeywords.test(title) || filmKeywords.test(channel)) {
        lastCapturedUrl = currentUrl;
        chrome.runtime.sendMessage({
          type: 'PLOTTED_STREAM_DETECTED',
          data: {
            streamType: 'youtube',
            title: title,
            channel: channel,
            url: currentUrl,
            notes: 'Captured film-related video essay / review / breakdown'
          }
        });
      }
    }
  }

  // Hook YouTube SPA navigation events
  window.addEventListener('yt-navigate-finish', () => {
    setTimeout(inspectYouTubeContent, 1000);
  });
  window.addEventListener('load', () => {
    setTimeout(inspectYouTubeContent, 1500);
  });

  // Observe Shorts scroll navigation
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (window.location.pathname.startsWith('/shorts')) {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(inspectYouTubeContent, 600);
    }
  }, { passive: true });
})();
