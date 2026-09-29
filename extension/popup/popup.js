document.addEventListener('DOMContentLoaded', () => {
  // Safe DOM creation for recommendations (Eliminates XSS)
  function renderRecommendations(container, recs) {
    container.textContent = ''; // Clear container safely

    if (!recs || recs.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'rec-reason';
      emptyDiv.textContent = 'Browse YouTube or streaming sites to generate recommendations.';
      container.appendChild(emptyDiv);
      return;
    }

    recs.slice(0, 2).forEach(r => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'rec-item';

      const headerDiv = document.createElement('div');
      headerDiv.className = 'rec-header';

      const titleSpan = document.createElement('span');
      titleSpan.className = 'rec-title';
      titleSpan.textContent = `${r.title || 'Untitled'} (${r.year || '2024'})`;

      const scoreSpan = document.createElement('span');
      scoreSpan.className = 'rec-score';
      scoreSpan.textContent = `${r.matchScore || 90}% Match`;

      headerDiv.appendChild(titleSpan);
      headerDiv.appendChild(scoreSpan);

      const reasonDiv = document.createElement('div');
      reasonDiv.className = 'rec-reason';
      reasonDiv.textContent = r.whyItMatched || 'Matched your recent cinema search signals.';

      itemDiv.appendChild(headerDiv);
      itemDiv.appendChild(reasonDiv);
      container.appendChild(itemDiv);
    });
  }

  // Load stored signals and profile
  chrome.storage.local.get(['plotted_history_events', 'plotted_taste_profile', 'plotted_api_url'], (res) => {
    const events = res.plotted_history_events || [];
    const profile = res.plotted_taste_profile;
    const apiUrl = res.plotted_api_url || 'http://localhost:3000';

    const shorts = events.filter(e => e.type === 'youtube_shorts' || e.isShorts).length;
    const yt = events.filter(e => e.type === 'youtube' && !e.isShorts).length;
    const search = events.filter(e => e.type === 'search').length;
    const stream = events.filter(e => e.type === 'pirate_stream').length;

    const shortsEl = document.getElementById('shorts-count');
    const ytEl = document.getElementById('yt-count');
    const searchEl = document.getElementById('search-count');
    const streamEl = document.getElementById('stream-count');

    if (shortsEl) shortsEl.textContent = String(shorts);
    if (ytEl) ytEl.textContent = String(yt);
    if (searchEl) searchEl.textContent = String(search);
    if (streamEl) streamEl.textContent = String(stream);

    if (profile && profile.tasteArchetype) {
      const nameEl = document.getElementById('archetype-name');
      const descEl = document.getElementById('archetype-desc');
      if (nameEl) nameEl.textContent = profile.tasteArchetype;
      if (descEl) descEl.textContent = profile.archetypeDescription;
    }

    const recsBox = document.getElementById('recs-container');
    if (recsBox) {
      renderRecommendations(recsBox, profile?.recommendations || []);
    }

    const apiUrlInput = document.getElementById('api-url-input');
    if (apiUrlInput) {
      apiUrlInput.value = apiUrl;
    }
  });

  // Settings drawer toggle
  const toggleBtn = document.getElementById('toggle-settings');
  const drawer = document.getElementById('settings-drawer');
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('hidden');
    });
  }

  // Save API URL
  const saveBtn = document.getElementById('save-api-url');
  const syncStatus = document.getElementById('sync-status');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const input = document.getElementById('api-url-input');
      const newUrl = input ? input.value.trim() : 'http://localhost:3000';
      chrome.storage.local.set({ plotted_api_url: newUrl }, () => {
        if (syncStatus) {
          syncStatus.textContent = 'API URL saved!';
          setTimeout(() => { syncStatus.textContent = 'Ready'; }, 2000);
        }
      });
    });
  }

  // Sync Now action
  const syncBtn = document.getElementById('sync-now-btn');
  if (syncBtn) {
    syncBtn.addEventListener('click', () => {
      if (syncStatus) syncStatus.textContent = 'Syncing events...';
      chrome.runtime.sendMessage({ type: 'SYNC_NOW' }, (response) => {
        if (syncStatus) {
          if (response && response.success) {
            syncStatus.textContent = `Synced ${response.count} events!`;
          } else {
            syncStatus.textContent = `Sync failed (${response?.error || 'Offline'})`;
          }
          setTimeout(() => { syncStatus.textContent = 'Ready'; }, 3000);
        }
      });
    });
  }

  // Open Web Companion Dashboard
  const openBtn = document.getElementById('open-dashboard');
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      chrome.storage.local.get(['plotted_api_url'], (res) => {
        const url = res.plotted_api_url || 'http://localhost:3000';
        chrome.tabs.create({ url: url });
      });
    });
  }
});
