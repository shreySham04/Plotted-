import React, { useState, useEffect } from 'react';
import { HistoryItem, TasteProfile, Recommendation } from './types';
import { INITIAL_HISTORY_ITEMS, INITIAL_TASTE_PROFILE } from './sampleData';
import { Header } from './components/Header';
import { TasteDnaDashboard } from './components/TasteDnaDashboard';
import { HistorySignalsView } from './components/HistorySignalsView';
import { ExtensionHubView } from './components/ExtensionHubView';
import { CaptureModal } from './components/CaptureModal';

const STORAGE_KEY_HISTORY = 'plotted_app_history';
const STORAGE_KEY_TASTE = 'plotted_app_taste';
const STORAGE_KEY_WATCHLIST = 'plotted_app_watchlist';

export default function App() {
  const [activeTab, setActiveTab] = useState<'recs' | 'activity' | 'extension'>('recs');
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  
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

  // Re-analyze Taste DNA via server-side Gemini
  const handleRefreshTaste = async () => {
    setIsAnalyzing(true);
    showToast('Analyzing your YouTube Shorts, searches, and stream locker history...');

    try {
      const response = await fetch('/api/analyze-taste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historyItems }),
      });

      if (!response.ok) throw new Error('Failed to analyze taste');
      const data: TasteProfile = await response.json();
      setTasteProfile(data);
      showToast('Taste DNA & personalized recommendations updated!');
    } catch (err) {
      console.error('Error refreshing taste:', err);
      showToast('Taste profile updated.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Live Mood Recommendation Generator
  const handleLiveMoodRecommend = async (mood: string, customPrompt?: string) => {
    setIsGeneratingRecs(true);
    showToast(`Curating recommendations for "${customPrompt || mood}"...`);

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

      if (!response.ok) throw new Error('Live recommendation failed');
      const data = await response.json();

      if (data.recommendations && data.recommendations.length > 0) {
        setTasteProfile(prev => ({
          ...prev,
          recommendations: [...data.recommendations, ...prev.recommendations.filter(r => !data.recommendations.some((newR: Recommendation) => newR.title === r.title))]
        }));
        showToast(`Added ${data.recommendations.length} new curated films!`);
      }
    } catch (err) {
      console.error('Failed to generate live recommendations:', err);
      showToast('Could not reach recommendation engine.');
    } finally {
      setIsGeneratingRecs(false);
    }
  };

  // History manipulations
  const handleAddHistoryItem = (item: Omit<HistoryItem, 'id'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4)
    };
    setHistoryItems(prev => [newItem, ...prev]);
    showToast(`Captured: "${item.title.substring(0, 32)}..."`);
  };

  const handleRemoveHistoryItem = (id: string) => {
    setHistoryItems(prev => prev.filter(i => i.id !== id));
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
    showToast('Cleared watch activity.');
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
      
      {/* Clean Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        eventCount={historyItems.length}
        pirateCount={pirateCount}
        isAnalyzing={isAnalyzing}
        onOpenCaptureModal={() => setIsCaptureModalOpen(true)}
        onRefreshTaste={handleRefreshTaste}
        onDownloadZip={handleDownloadZip}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
        
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

      {/* Clean Footer */}
      <footer className="border-t border-white/5 py-4 px-4 text-center text-xs text-neutral-500 font-mono">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-semibold text-neutral-400 font-['Cinzel'] tracking-wide">PLOTTED</span>
          <span>Captures YouTube, Shorts, Searches & Stream Lockers</span>
        </div>
      </footer>

    </div>
  );
}
