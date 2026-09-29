// Plotted Stream Player & Content Detector
// Intercepts HTML5 <video> elements, embedded video players, and strips title wrappers.

(function() {
  const currentHost = window.location.hostname.toLowerCase();
  const currentUrl = window.location.href.toLowerCase();

  // Known third-party video locker patterns
  const STREAM_LOCKER_PATTERNS = [
    /fmovies/, /123movies/, /soap2day/, /bflix/, /hurawatch/, /movie-web/,
    /vidcloud/, /streamtape/, /myflixer/, /putlocker/, /gomovies/, /sflix/,
    /yts\./, /torrent/, /lookmovie/, /flixhq/, /vumoo/, /solarmovie/, /stremio/
  ];

  const OFFICIAL_STREAMING_PATTERNS = [
    /netflix\.com/, /primevideo\.com/, /max\.com/, /mubi\.com/, /criterionchannel\.com/, /hulu\.com/, /apple\.com\/tv/
  ];

  function cleanMovieTitle(raw) {
    if (!raw) return '';
    return raw
      .replace(/watch|free|online|hd|1080p|720p|4k|full movie|download|subbed|dubbed|stream|fmovies|123movies|soap2day|putlocker/gi, '')
      .replace(/\|.*|-.*|–.*/, '') // Strip site branding suffix
      .replace(/[\[\]()]/g, '')
      .trim();
  }

  let captured = false;

  function detectPlayback() {
    if (captured) return;

    const isLocker = STREAM_LOCKER_PATTERNS.some(p => p.test(currentHost) || p.test(currentUrl));
    const isOfficial = OFFICIAL_STREAMING_PATTERNS.some(p => p.test(currentHost));
    
    // Check for active HTML5 video or player iframes
    const videoElements = document.querySelectorAll('video');
    const iframeElements = document.querySelectorAll('iframe');
    const hasPlayer = videoElements.length > 0 || Array.from(iframeElements).some(f => /player|embed|stream|cloud|jw/i.test(f.src));

    if ((isLocker || isOfficial) && (hasPlayer || document.title)) {
      const cleanTitle = cleanMovieTitle(document.title);
      if (cleanTitle && cleanTitle.length > 2) {
        captured = true;
        chrome.runtime.sendMessage({
          type: 'PLOTTED_STREAM_DETECTED',
          data: {
            streamType: isLocker ? 'pirate_stream' : 'official_stream',
            title: cleanTitle,
            url: window.location.href,
            notes: isLocker ? 'Captured from 3rd-party video locker / unindexed host' : 'Captured from licensed streaming service'
          }
        });
      }
    }
  }

  window.addEventListener('load', () => {
    setTimeout(detectPlayback, 1500);
  });

  const observer = new MutationObserver(() => {
    detectPlayback();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
