// Plotted Search Query Content Script
// Captures movie recommendation inquiries, ending explanations, and cinematic discussions.

(function() {
  function captureFilmSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || urlParams.get('query');
    if (!query) return;

    // Filter strictly for film, movie, actor, director, and plot inquiries
    const filmQueryKeywords = /movie|movies|film|films|ending explained|cast|cinematography|director|soundtrack|imdb|letterboxd|reddit.*movie|movies like|recommendations.*movie|oscars|scene explained/i;
    
    if (filmQueryKeywords.test(query)) {
      chrome.runtime.sendMessage({
        type: 'PLOTTED_STREAM_DETECTED',
        data: {
          streamType: 'search',
          title: 'Search: ' + query.trim(),
          query: query.trim(),
          url: window.location.href,
          notes: 'Captured film inquiry on search engine'
        }
      });
    }
  }

  window.addEventListener('load', captureFilmSearch);
})();
