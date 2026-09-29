document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['plotted_history_events', 'plotted_taste_profile'], (res) => {
    const events = res.plotted_history_events || [];
    const profile = res.plotted_taste_profile;

    const shorts = events.filter(e => e.type === 'youtube_shorts' || e.isShorts).length;
    const yt = events.filter(e => e.type === 'youtube' && !e.isShorts).length;
    const search = events.filter(e => e.type === 'search').length;
    const stream = events.filter(e => e.type === 'pirate_stream').length;

    const shortsEl = document.getElementById('shorts-count');
    const ytEl = document.getElementById('yt-count');
    const searchEl = document.getElementById('search-count');
    const streamEl = document.getElementById('stream-count');

    if (shortsEl) shortsEl.textContent = shorts;
    if (ytEl) ytEl.textContent = yt;
    if (searchEl) searchEl.textContent = search;
    if (streamEl) streamEl.textContent = stream;

    if (profile && profile.tasteArchetype) {
      const nameEl = document.getElementById('archetype-name');
      const descEl = document.getElementById('archetype-desc');
      if (nameEl) nameEl.textContent = profile.tasteArchetype;
      if (descEl) descEl.textContent = profile.archetypeDescription;
    }

    const recsBox = document.getElementById('recs-container');
    if (recsBox && profile && profile.recommendations && profile.recommendations.length > 0) {
      recsBox.innerHTML = profile.recommendations.slice(0, 2).map(r => `
        <div class="rec-item">
          <div class="rec-header">
            <span class="rec-title">${r.title} (${r.year})</span>
            <span class="rec-score">${r.matchScore}% Match</span>
          </div>
          <div class="rec-reason">${r.whyItMatched}</div>
        </div>
      `).join('');
    }
  });

  const btn = document.getElementById('open-dashboard');
  if (btn) {
    btn.addEventListener('click', () => {
      chrome.tabs.create({ url: 'http://localhost:3000' });
    });
  }
});
