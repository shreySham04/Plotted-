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

// Push event to Backend Event Ingestion API (/api/events)
async function sendEventToBackend(event) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events`, {
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
  return new Promise((resolve) => {
    chrome.storage.local.get([TASTE_LOG_KEY], async (res) => {
      const list = res[TASTE_LOG_KEY] || [];
      if (list.length === 0) return resolve({ synced: 0 });

      try {
        const response = await fetch(`${API_BASE_URL}/api/events`, {
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
