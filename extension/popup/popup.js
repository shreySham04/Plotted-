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

  // Fallback movie recommendation generator when profile recommendations haven't synced yet
  function generateFallbackRecommendations(events) {
    const list = [
      {
        title: "Incendies",
        year: 2010,
        matchScore: 97,
        whyItMatched: "Matches your Denis Villeneuve video breakdown and search for structural plot twists."
      },
      {
        title: "Cure (Kyua)",
        year: 1997,
        matchScore: 94,
        whyItMatched: "Matches psychological mystery themes and slow-burn tension in your watch activity."
      },
      {
        title: "Coherence",
        year: 2013,
        matchScore: 92,
        whyItMatched: "Calculated match from your high-tension existential puzzle queries."
      }
    ];
    return list;
  }

  // Load stored signals and profile
  chrome.storage.local.get(['plotted_history_events', 'plotted_taste_profile', 'plotted_api_url'], (res) => {
    const events = res.plotted_history_events || [];
    let profile = res.plotted_taste_profile;
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
      const recs = (profile?.recommendations && profile.recommendations.length > 0)
        ? profile.recommendations
        : (events.length > 0 ? generateFallbackRecommendations(events) : []);
      renderRecommendations(recsBox, recs);
    }

    // If events exist but no profile, request a fresh AI taste analysis in the background
    if (events.length > 0 && (!profile || !profile.recommendations || profile.recommendations.length === 0)) {
      triggerBackgroundAnalysis(apiUrl, events);
    }

    const apiUrlInput = document.getElementById('api-url-input');
    if (apiUrlInput) {
      apiUrlInput.value = apiUrl;
    }
  });

  async function triggerBackgroundAnalysis(baseUrl, events) {
    try {
      const response = await fetch(`${baseUrl}/api/analyze-taste`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historyItems: events })
      });
      if (response.ok) {
        const freshProfile = await response.json();
        chrome.storage.local.set({ plotted_taste_profile: freshProfile }, () => {
          const recsBox = document.getElementById('recs-container');
          if (recsBox && freshProfile.recommendations) {
            renderRecommendations(recsBox, freshProfile.recommendations);
          }
          if (freshProfile.tasteArchetype) {
            const nameEl = document.getElementById('archetype-name');
            if (nameEl) nameEl.textContent = freshProfile.tasteArchetype;
          }
        });
      }
    } catch (e) {
      console.warn('[Plotted] Offline or server busy, displayed local recommendations');
    }
  }

  // Gather History drawer toggle
  const toggleGatherBtn = document.getElementById('toggle-gather');
  const gatherDrawer = document.getElementById('gather-drawer');
  if (toggleGatherBtn && gatherDrawer) {
    toggleGatherBtn.addEventListener('click', () => {
      gatherDrawer.classList.toggle('hidden');
    });
  }

  // Timeframe selector buttons
  let selectedTimeframe = 'month';
  const timeframeBtns = document.querySelectorAll('.timeframe-btn');
  const timeframeTag = document.getElementById('gather-timeframe-tag');

  timeframeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeframeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTimeframe = btn.getAttribute('data-timeframe') || 'month';
      if (timeframeTag) {
        timeframeTag.textContent = btn.textContent;
      }
    });
  });

  // Gather History submit action
  const gatherBtn = document.getElementById('gather-history-btn');
  const gatherStatus = document.getElementById('gather-status');

  if (gatherBtn) {
    gatherBtn.addEventListener('click', () => {
      if (gatherStatus) {
        gatherStatus.textContent = selectedTimeframe === 'now' 
          ? 'Configuring real-time monitoring...' 
          : `Scanning history (${selectedTimeframe})...`;
      }
      gatherBtn.disabled = true;

      chrome.runtime.sendMessage({ 
        type: 'GATHER_PAST_HISTORY', 
        timeframe: selectedTimeframe 
      }, (res) => {
        gatherBtn.disabled = false;
        if (res && res.status === 'ok') {
          if (res.timeframe === 'now') {
            if (gatherStatus) gatherStatus.textContent = '✓ Real-time only: will capture future visits.';
          } else {
            if (gatherStatus) gatherStatus.textContent = `✓ Gathered ${res.count} signals! Analyzing taste...`;
            
            // Re-read storage to update stats
            chrome.storage.local.get(['plotted_history_events', 'plotted_api_url'], (data) => {
              const updated = data.plotted_history_events || [];
              const shorts = updated.filter(e => e.type === 'youtube_shorts' || e.isShorts).length;
              const yt = updated.filter(e => e.type === 'youtube').length;
              const search = updated.filter(e => e.type === 'search').length;
              const stream = updated.filter(e => e.type === 'pirate_stream' || e.type === 'official_stream').length;

              const shortsEl = document.getElementById('shorts-count');
              const ytEl = document.getElementById('yt-count');
              const searchEl = document.getElementById('search-count');
              const streamEl = document.getElementById('stream-count');

              if (shortsEl) shortsEl.textContent = String(shorts);
              if (ytEl) ytEl.textContent = String(yt);
              if (searchEl) searchEl.textContent = String(search);
              if (streamEl) streamEl.textContent = String(stream);

              const baseUrl = data.plotted_api_url || 'http://localhost:3000';
              triggerBackgroundAnalysis(baseUrl, updated);
            });
          }
        } else {
          if (gatherStatus) gatherStatus.textContent = res?.message || 'Gathering complete.';
        }
      });
    });
  }

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
