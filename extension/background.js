// Plotted Background Service Worker (Manifest V3)
// Intercepts browser cinema signals, stores them locally, and syncs with the Plotted Backend API.

const TASTE_LOG_KEY = 'plotted_history_events';
const API_BASE_URL = 'http://localhost:3000'; // Default host, customizable in popup settings

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Plotted] Service Worker activated. Initializing intelligent watch monitor.');
  chrome.storage.local.get([TASTE_LOG_KEY], (res) => {
    if (!res[TASTE_LOG_KEY]) {
      chrome.storage.local.set({ [TASTE_LOG_KEY]: [] });
    }
  });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PLOTTED_STREAM_DETECTED') {
    const newEvent = {
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      type: message.data.streamType, // 'youtube', 'youtube_shorts', 'search', 'pirate_stream', 'official_stream'
      isShorts: message.data.streamType === 'youtube_shorts',
      title: message.data.title,
      query: message.data.query,
      url: sender.tab?.url || message.data.url,
      channel: message.data.channel,
      duration: message.data.duration,
      timestamp: new Date().toISOString(),
      notes: message.data.notes || 'Auto-captured by Plotted Background Inspector'
    };

    handleNewWatchEvent(newEvent);
    sendResponse({ status: 'captured', id: newEvent.id });
  } else if (message.type === 'GET_TASTE_EVENTS') {
    chrome.storage.local.get([TASTE_LOG_KEY], (result) => {
      sendResponse({ events: result[TASTE_LOG_KEY] || [] });
    });
    return true;
  } else if (message.type === 'SYNC_NOW') {
    syncEventsWithBackend().then(res => sendResponse(res));
    return true;
  } else if (message.type === 'GATHER_PAST_HISTORY') {
    importBrowserHistory(message.timeframe || 'month', (result) => {
      sendResponse(result);
    });
    return true;
  }
});

function handleNewWatchEvent(event) {
  chrome.storage.local.get([TASTE_LOG_KEY], (res) => {
    const list = res[TASTE_LOG_KEY] || [];
    
    // Deduplication: prevent duplicate events within 5 minutes for the exact same title
    const now = Date.now();
    const isDup = list.some(item => 
      item.title === event.title && 
      (now - new Date(item.timestamp).getTime() < 300000)
    );

    if (!isDup) {
      list.unshift(event);
      if (list.length > 500) list.pop();
      
      chrome.storage.local.set({ [TASTE_LOG_KEY]: list }, () => {
        console.log('[Plotted] Logged new cinema signal:', event.title, `(${event.type})`);
        
        // Update badge
        chrome.action.setBadgeText({ text: String(Math.min(list.length, 99)) });
        chrome.action.setBadgeBackgroundColor({ color: '#6366f1' });

        // Forward event to backend ingestion API asynchronously
        sendEventToBackend(event);
      });
    }
  });
}

// Helper to get active API Base URL
async function getApiBaseUrl() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['plotted_api_url'], (res) => {
      resolve(res.plotted_api_url || 'http://localhost:3000');
    });
  });
}

// Push event to Backend Event Ingestion API (/api/events)
async function sendEventToBackend(event) {
  try {
    const baseUrl = await getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: [event] })
    });
    if (response.ok) {
      console.log('[Plotted] Successfully synced event to backend API:', event.id);
    }
  } catch (err) {
    // Graceful offline queue: backend may be unreachable or offline; local storage retains data
    console.warn('[Plotted] Backend ingestion offline, saved in local storage:', err.message);
  }
}

// Bulk sync local events with backend
async function syncEventsWithBackend() {
  const baseUrl = await getApiBaseUrl();
  return new Promise((resolve) => {
    chrome.storage.local.get([TASTE_LOG_KEY], async (res) => {
      const list = res[TASTE_LOG_KEY] || [];
      if (list.length === 0) return resolve({ success: true, count: 0 });

      try {
        const response = await fetch(`${baseUrl}/api/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events: list })
        });
        if (response.ok) {
          resolve({ success: true, count: list.length });
        } else {
          resolve({ success: false, error: 'Server returned error status' });
        }
      } catch (err) {
        resolve({ success: false, error: err.message });
      }
    });
  });
}

// Retroactive Browser History Gathering
// Scans Chrome's history API for YouTube watches, Shorts, search queries, and movie streams
function importBrowserHistory(timeframe, callback) {
  if (timeframe === 'now') {
    chrome.storage.local.set({ plotted_history_timeframe: 'now' }, () => {
      if (callback) callback({ status: 'ok', count: 0, timeframe: 'now', message: 'Monitoring from now on only.' });
    });
    return;
  }

  const now = Date.now();
  let startTime = 0;
  if (timeframe === 'week') {
    startTime = now - (7 * 24 * 60 * 60 * 1000);
  } else if (timeframe === 'month') {
    startTime = now - (30 * 24 * 60 * 60 * 1000);
  } else if (timeframe === 'year') {
    startTime = now - (365 * 24 * 60 * 60 * 1000);
  } else if (timeframe === 'all') {
    startTime = 0;
  }

  chrome.history.search({
    text: '',
    startTime: startTime,
    maxResults: 5000
  }, (historyEntries) => {
    if (!historyEntries || historyEntries.length === 0) {
      if (callback) callback({ status: 'ok', count: 0, timeframe, message: 'No matching media history found.' });
      return;
    }

    const detectedEvents = [];
    const seenUrls = new Set();

    for (const item of historyEntries) {
      if (!item.url || seenUrls.has(item.url)) continue;
      seenUrls.add(item.url);

      try {
        const parsedUrl = new URL(item.url);
        const host = parsedUrl.hostname.toLowerCase();
        const path = parsedUrl.pathname.toLowerCase();
        const title = (item.title || '').trim();

        // 1. YouTube Shorts
        if (host.includes('youtube.com') && path.startsWith('/shorts')) {
          let cleanTitle = title.replace(/\s*-\s*YouTube$/i, '').trim();
          detectedEvents.push({
            id: 'evt_hist_' + (item.id || Math.random().toString(36).substring(2, 9)),
            type: 'youtube_shorts',
            isShorts: true,
            title: cleanTitle || 'YouTube Short',
            url: item.url,
            timestamp: new Date(item.lastVisitTime || Date.now()).toISOString(),
            notes: `Retroactively gathered from ${timeframe} history`
          });
        }
        // 2. YouTube regular video
        else if (host.includes('youtube.com') && (path.startsWith('/watch') || path.startsWith('/embed/'))) {
          let cleanTitle = title.replace(/\s*-\s*YouTube$/i, '').trim();
          detectedEvents.push({
            id: 'evt_hist_' + (item.id || Math.random().toString(36).substring(2, 9)),
            type: 'youtube',
            isShorts: false,
            title: cleanTitle || 'YouTube Video',
            url: item.url,
            timestamp: new Date(item.lastVisitTime || Date.now()).toISOString(),
            notes: `Retroactively gathered from ${timeframe} history`
          });
        }
        // 3. Search queries (Google, DuckDuckGo, Bing)
        else if (
          (host.includes('google.com') && path.startsWith('/search')) ||
          (host.includes('duckduckgo.com')) ||
          (host.includes('bing.com') && path.startsWith('/search'))
        ) {
          const q = parsedUrl.searchParams.get('q');
          if (q && q.trim().length > 1) {
            detectedEvents.push({
              id: 'evt_hist_' + (item.id || Math.random().toString(36).substring(2, 9)),
              type: 'search',
              query: q.trim(),
              title: `Search: "${q.trim()}"`,
              url: item.url,
              timestamp: new Date(item.lastVisitTime || Date.now()).toISOString(),
              notes: `Retroactively gathered from ${timeframe} history`
            });
          }
        }
        // 4. Movie streaming sites & platforms
        else if (
          host.includes('netflix.com/watch') || host.includes('primevideo.com') ||
          host.includes('hulu.com/watch') || host.includes('disneyplus.com') ||
          host.includes('fmovies') || host.includes('123movies') || host.includes('soap2day') ||
          host.includes('hurawatch') || host.includes('bflix') || host.includes('lookmovie') ||
          /watch|movie|stream|film|episode/i.test(path) || /movie|watch online|free hd/i.test(title)
        ) {
          if (title.length > 2 && !/^(google|bing|search|login|sign in|home|index)/i.test(title)) {
            const isOfficial = host.includes('netflix') || host.includes('primevideo') || host.includes('hulu') || host.includes('disneyplus');
            let clean = title.replace(/\s*-\s*(123movies|fmovies|hurawatch|netflix|prime video|soap2day|lookmovie).*$/i, '').trim();
            detectedEvents.push({
              id: 'evt_hist_' + (item.id || Math.random().toString(36).substring(2, 9)),
              type: isOfficial ? 'official_stream' : 'pirate_stream',
              title: clean || title,
              url: item.url,
              timestamp: new Date(item.lastVisitTime || Date.now()).toISOString(),
              notes: `Retroactively gathered from ${timeframe} history`
            });
          }
        }
      } catch (e) {
        // Skip invalid URL
      }
    }

    // Merge with existing events and deduplicate
    chrome.storage.local.get([TASTE_LOG_KEY], (res) => {
      const existing = res[TASTE_LOG_KEY] || [];
      const combined = [...detectedEvents, ...existing];
      const unique = [];
      const seen = new Set();

      for (const ev of combined) {
        const key = (ev.title || '') + '|' + (ev.url || '');
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(ev);
        }
      }

      const trimmed = unique.slice(0, 500);

      chrome.storage.local.set({
        [TASTE_LOG_KEY]: trimmed,
        plotted_history_timeframe: timeframe,
        plotted_last_gathered_at: new Date().toISOString()
      }, () => {
        chrome.action.setBadgeText({ text: String(Math.min(trimmed.length, 99)) });
        chrome.action.setBadgeBackgroundColor({ color: '#6366f1' });

        // Forward to backend
        syncEventsWithBackend();

        if (callback) {
          callback({
            status: 'ok',
            count: detectedEvents.length,
            total: trimmed.length,
            timeframe,
            message: `Gathered ${detectedEvents.length} cinema & search signals from ${timeframe}.`
          });
        }
      });
    });
  });
}

