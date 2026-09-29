import React, { useState, useEffect } from 'react';
import { HistoryItem, TasteProfile, Recommendation } from './types';
import { INITIAL_HISTORY_ITEMS, INITIAL_TASTE_PROFILE, getSampleHistoryForTimeframe } from './sampleData';
import { Header } from './components/Header';
import { TasteDnaDashboard } from './components/TasteDnaDashboard';
import { HistorySignalsView } from './components/HistorySignalsView';
import { ExtensionHubView } from './components/ExtensionHubView';
import { CaptureModal } from './components/CaptureModal';
import { HistoryImportModal, TimeframeOption } from './components/HistoryImportModal';
import { AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY_HISTORY = 'plotted_app_history';
const STORAGE_KEY_TASTE = 'plotted_app_taste';
const STORAGE_KEY_WATCHLIST = 'plotted_app_watchlist';
const STORAGE_KEY_TIMEFRAME = 'plotted_app_timeframe';

export default function App() {
  const [activeTab, setActiveTab] = useState<'recs' | 'activity' | 'extension'>('recs');
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [isGatherModalOpen, setIsGatherModalOpen] = useState(false);
  const [currentTimeframe, setCurrentTimeframe] = useState<TimeframeOption>(() => {
    return (localStorage.getItem(STORAGE_KEY_TIMEFRAME) as TimeframeOption) || 'month';
  });
  
  // History Items State (includes YouTube, YouTube Shorts, Search, Stream Lockers)
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
    return INITIAL_HISTORY_ITEMS;
  });

  // Taste Profile State
  const [tasteProfile, setTasteProfile] = useState<TasteProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASTE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load taste profile from localStorage', e);
    }
    return INITIAL_TASTE_PROFILE;
  });

  // Watchlist State
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WATCHLIST);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load watchlist from localStorage', e);
    }
    return ['Incendies', 'Cure (Kyua)'];
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingRecs, setIsGeneratingRecs] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);

  // Fetch Authoritative Event Bus on Mount
  useEffect(() => {
    fetch('/api/events')
      .then(res => {
        if (!res.ok) throw new Error('Failed to reach backend event bus');
        return res.json();
      })
      .then(data => {
        if (data.events && Array.isArray(data.events)) {
          setHistoryItems(data.events);
          setIsBackendConnected(true);
        }
      })
      .catch(err => {
        console.warn('[Plotted] Backend events offline, relying on cached state:', err);
        setIsBackendConnected(false);
      });
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(historyItems));
    } catch (e) {
      console.error(e);
    }
  }, [historyItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASTE, JSON.stringify(tasteProfile));
    } catch (e) {
      console.error(e);
    }
  }, [tasteProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WATCHLIST, JSON.stringify(watchlist));
    } catch (e) {
      console.error(e);
    }
  }, [watchlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Re-analyze Taste DNA via server-side Gemini & mathematical ranking
  const handleRefreshTaste = async (itemsToAnalyze?: HistoryItem[]) => {
    const targetItems = itemsToAnalyze || historyItems;
    setIsAnalyzing(true);
    setApiError(null);
    showToast('Computing feature vectors & mathematical ranking...');

    try {
      const response = await fetch('/api/analyze-taste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historyItems: targetItems }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        throw new Error(errJson?.message || `Server returned ${response.status}`);
      }

      const data: TasteProfile = await response.json();
      setTasteProfile(data);
      showToast('Taste DNA & recommendations synchronized!');
    } catch (err: any) {
      console.error('Error refreshing taste:', err);
      setApiError(err.message || 'Taste analysis request failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Retroactive History Gathering across selected timeframe
  const handleApplyTimeframe = async (timeframe: TimeframeOption) => {
    setCurrentTimeframe(timeframe);
    try {
      localStorage.setItem(STORAGE_KEY_TIMEFRAME, timeframe);
    } catch (e) {
      console.error(e);
    }
    setIsGatherModalOpen(false);

    if (timeframe === 'now') {
      showToast('Configured: Plotted will gather future browsing from now on.');
      return;
    }

    const items = getSampleHistoryForTimeframe(timeframe);
    setHistoryItems(items);
    const label = timeframe === 'week' ? 'Last Week' : timeframe === 'month' ? 'Last Month' : timeframe === 'year' ? 'Last Year' : 'All Time';
    showToast(`Gathered ${items.length} signals from ${label}! Recalculating Taste DNA...`);

    // Ingest into backend authoritative event bus
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: items }),
      });
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e);
    }

    // Trigger immediate AI taste analysis
    handleRefreshTaste(items);
  };

  // Live Mood Recommendation Generator
  const handleLiveMoodRecommend = async (mood: string, customPrompt?: string) => {
    setIsGeneratingRecs(true);
    setApiError(null);
    showToast(`Ranking candidates for "${customPrompt || mood}"...`);

    try {
      const response = await fetch('/api/recommend-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood,
          customPrompt,
          tasteProfile
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        throw new Error(errJson?.message || `Server returned ${response.status}`);
      }

      const data = await response.json();

      if (data.recommendations && data.recommendations.length > 0) {
        setTasteProfile(prev => ({
          ...prev,
          recommendations: [...data.recommendations, ...prev.recommendations.filter(r => !data.recommendations.some((newR: Recommendation) => newR.title === r.title))]
        }));
        showToast(`Added ${data.recommendations.length} scored recommendations!`);
      }
    } catch (err: any) {
      console.error('Failed to generate live recommendations:', err);
      setApiError(err.message || 'Live recommendation engine failed');
    } finally {
      setIsGeneratingRecs(false);
    }
  };

  // Unified Event Ingestion (Pushes to state & backend ingestion API)
  const handleAddHistoryItem = async (item: Omit<HistoryItem, 'id'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)
    };

    setHistoryItems(prev => [newItem, ...prev]);
    showToast(`Captured: "${item.title.substring(0, 32)}..."`);

    // Synchronize to backend event ingestion API
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: [newItem] })
      });
      setIsBackendConnected(true);
    } catch (e) {
      console.warn('[Plotted] Backend ingestion offline, saved in local store:', e);
      setIsBackendConnected(false);
    }
  };

  const handleRemoveHistoryItem = (id: string) => {
    setHistoryItems(prev => prev.filter(i => i.id !== id));
  };

  const handleClearHistory = async () => {
    setHistoryItems([]);
    showToast('Cleared watch activity.');
    try {
      await fetch('/api/events', { method: 'DELETE' });
    } catch (e) {
      console.error('Error clearing backend events:', e);
    }
  };

  // Watchlist
  const handleToggleWatchlist = (movieTitle: string) => {
    setWatchlist(prev => {
      if (prev.includes(movieTitle)) {
        return prev.filter(t => t !== movieTitle);
      } else {
        return [...prev, movieTitle];
      }
    });
  };

  // Download Chrome Extension ZIP
  const handleDownloadZip = () => {
    showToast('Downloading Plotted Chrome Extension ZIP...');
    const link = document.createElement('a');
    link.href = '/api/extension/download-zip';
    link.setAttribute('download', 'plotted-extension.zip');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const pirateCount = historyItems.filter(i => i.type === 'pirate_stream').length;

  return (
    <div className="min-h-screen bg-[#07080b] text-[#f3f4f6] selection:bg-indigo-600 selection:text-white flex flex-col font-sans">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        eventCount={historyItems.length}
        pirateCount={pirateCount}
        isAnalyzing={isAnalyzing}
        onOpenCaptureModal={() => setIsCaptureModalOpen(true)}
        onOpenGatherModal={() => setIsGatherModalOpen(true)}
        onRefreshTaste={handleRefreshTaste}
        onDownloadZip={handleDownloadZip}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
        
        {/* Real API Error Notification (No masked errors) */}
        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center justify-between gap-3 text-xs font-mono animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span><strong>Backend Analysis Error:</strong> {apiError}. Existing taste profile preserved.</span>
            </div>
            <button
              onClick={() => handleRefreshTaste()}
              disabled={isAnalyzing}
              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1 shrink-0"
            >
              <RefreshCw className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {activeTab === 'recs' && (
          <TasteDnaDashboard
            tasteProfile={tasteProfile}
            historyItems={historyItems}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onLiveMoodRecommend={handleLiveMoodRecommend}
            isGeneratingRecs={isGeneratingRecs}
            onOpenCaptureModal={() => setIsCaptureModalOpen(true)}
          />
        )}

        {activeTab === 'activity' && (
          <HistorySignalsView
            historyItems={historyItems}
            onOpenCaptureModal={() => setIsCaptureModalOpen(true)}
            onOpenGatherModal={() => setIsGatherModalOpen(true)}
            onRemoveHistoryItem={handleRemoveHistoryItem}
            onClearHistory={handleClearHistory}
            onRefreshTaste={handleRefreshTaste}
            isAnalyzing={isAnalyzing}
          />
        )}

        {activeTab === 'extension' && (
          <ExtensionHubView
            tasteProfile={tasteProfile}
            historyItems={historyItems}
            onDownloadZip={handleDownloadZip}
          />
        )}

      </main>

      {/* Gather Previous History Modal */}
      <HistoryImportModal
        isOpen={isGatherModalOpen}
        onClose={() => setIsGatherModalOpen(false)}
        onApplyTimeframe={handleApplyTimeframe}
        currentTimeframe={currentTimeframe}
        isProcessing={isAnalyzing}
      />

      {/* Capture History Modal */}
      <CaptureModal
        isOpen={isCaptureModalOpen}
        onClose={() => setIsCaptureModalOpen(false)}
        onAddHistoryItem={handleAddHistoryItem}
        onRefreshTaste={handleRefreshTaste}
      />

      {/* Subtle Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-neutral-900 border border-white/10 text-white px-3.5 py-2.5 rounded-xl shadow-xl backdrop-blur-md flex items-center gap-2.5 font-sans text-xs animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Clean Footer with Real Sync Indicator */}
      <footer className="border-t border-white/5 py-4 px-4 text-center text-xs text-neutral-500 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-neutral-400 font-['Cinzel'] tracking-wide">PLOTTED</span>
          <div className="flex items-center gap-2 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span>Unified Event Bus: {isBackendConnected ? 'Connected & Synchronized' : 'Local Fallback'}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
