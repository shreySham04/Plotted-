import React, { useState } from 'react';
import { HistoryItem, TasteProfile, EventType } from '../types';
import { TEST_PERSONAS, TestPersona } from '../sampleData';
import { 
  X, 
  Sparkles, 
  Zap, 
  Youtube, 
  Search, 
  Film, 
  Tv, 
  FolderDown, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  Sliders, 
  Play, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Terminal,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface NewUserTestLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEventCount: number;
  onLoadPersona: (persona: TestPersona) => void;
  onSimulateEvent: (item: Omit<HistoryItem, 'id'>) => void;
  onRefreshTaste: () => void;
  onDownloadZip: () => void;
  isAnalyzing: boolean;
}

export const NewUserTestLabModal: React.FC<NewUserTestLabModalProps> = ({
  isOpen,
  onClose,
  currentEventCount,
  onLoadPersona,
  onSimulateEvent,
  onRefreshTaste,
  onDownloadZip,
  isAnalyzing
}) => {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'extension'>('sandbox');
  const [customTitle, setCustomTitle] = useState('');
  const [customType, setCustomType] = useState<EventType>('youtube_shorts');
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerFeedback = (msg: string) => {
    setLastActionMessage(msg);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#10b981', '#f59e0b']
    });
    setTimeout(() => setLastActionMessage(null), 3000);
  };

  const handleApplyPersona = (key: string) => {
    const persona = TEST_PERSONAS[key];
    if (!persona) return;
    onLoadPersona(persona);
    triggerFeedback(`Switched to "${persona.name}"!`);
  };

  const handleQuickSimulate = (
    type: EventType, 
    title: string, 
    extra?: { query?: string; channel?: string; detectedMovie?: string; isShorts?: boolean; url?: string }
  ) => {
    onSimulateEvent({
      type,
      title,
      isShorts: extra?.isShorts ?? (type === 'youtube_shorts'),
      channel: extra?.channel,
      query: extra?.query,
      detectedMovie: extra?.detectedMovie,
      url: extra?.url || (type === 'youtube_shorts' ? 'https://youtube.com/shorts/test' : 'https://google.com'),
      timestamp: 'Just now',
      notes: 'Captured via New User Interactive Simulation Lab'
    });
    triggerFeedback(`Simulated: "${title.substring(0, 30)}..."`);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    onSimulateEvent({
      type: customType,
      title: customTitle.trim(),
      isShorts: customType === 'youtube_shorts',
      timestamp: 'Just now',
      notes: 'Simulated custom event in Test Lab',
      url: customType === 'search' ? `https://google.com/search?q=${encodeURIComponent(customTitle)}` : undefined
    });

    setCustomTitle('');
    triggerFeedback('Custom browsing signal ingested!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c0d12] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-['Cinzel'] tracking-wide">
                  New User Testing Lab
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                  {currentEventCount} Events Active
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Experience Plotted as a first-time user or test browser event capture
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector: In-Browser vs Extension */}
        <div className="flex border-b border-white/10 bg-black/40 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-1.5 transition-all border-b-2 ${
              activeTab === 'sandbox'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-indigo-400" />
            <span>Method 1: Interactive Sandbox (Zero-Install)</span>
          </button>

          <button
            onClick={() => setActiveTab('extension')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-1.5 transition-all border-b-2 ${
              activeTab === 'extension'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FolderDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Method 2: Real Chrome Extension</span>
          </button>
        </div>

        {/* Toast in Modal */}
        {lastActionMessage && (
          <div className="bg-indigo-950/80 border-b border-indigo-500/30 px-5 py-2 text-xs text-indigo-200 flex items-center gap-2 font-mono">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lastActionMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {activeTab === 'sandbox' ? (
            <div className="space-y-6">
              
              {/* Step 1: Choose Persona or Clean Slate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
                    STEP 1: CHOOSE STARTING STATE
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Switch between a brand-new user or curated personas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.values(TEST_PERSONAS).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleApplyPersona(p.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        p.id === 'clean_slate'
                          ? 'bg-rose-950/20 border-rose-500/30 hover:bg-rose-950/40 text-rose-200'
                          : 'bg-neutral-900/80 border-white/10 hover:border-indigo-500/50 hover:bg-neutral-900 text-neutral-200'
                      }`}
                    >
                      <span className="text-xl shrink-0 p-1 bg-black/40 rounded-lg">{p.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white text-xs truncate flex items-center justify-between">
                          <span>{p.name}</span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {p.history.length} items
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                          {p.tagline}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: 1-Click Interactive Event Triggers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    STEP 2: SIMULATE BROWSER SIGNALS (1-CLICK)
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Simulate how the extension passively logs activity
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  
                  {/* YouTube Short */}
                  <button
                    onClick={() => handleQuickSimulate('youtube_shorts', 'The bone-chilling silence in Oppenheimer bomb test scene explained #shorts', {
                      channel: 'CinemaEdits',
                      isShorts: true,
                      detectedMovie: 'Oppenheimer (2023)'
                    })}
                    className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-red-500/50 hover:bg-red-950/20 text-left transition-all flex items-center gap-2.5 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-[11px] group-hover:text-red-300 truncate">
                        + Watch YouTube Short
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate">
                        Oppenheimer Sound Design #shorts
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 group-hover:text-white">Trigger</span>
                  </button>

                  {/* YouTube Video Essay */}
                  <button
                    onClick={() => handleQuickSimulate('youtube', 'Why Denis Villeneuve Is The Modern Master of Tension (Video Essay)', {
                      channel: 'Thomas Flight',
                      detectedMovie: 'Sicario / Prisoners'
                    })}
                    className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-red-500/50 hover:bg-red-950/20 text-left transition-all flex items-center gap-2.5 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                      <Youtube className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-[11px] group-hover:text-red-300 truncate">
                        + Watch YouTube Essay
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate">
                        Denis Villeneuve Tension Masterclass
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 group-hover:text-white">Trigger</span>
                  </button>

                  {/* Google Search Query */}
                  <button
                    onClick={() => handleQuickSimulate('search', 'Search: best atmospheric neo noir films with shocking plot twists reddit', {
                      query: 'best atmospheric neo noir films with shocking plot twists reddit'
                    })}
                    className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-amber-500/50 hover:bg-amber-950/20 text-left transition-all flex items-center gap-2.5 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-[11px] group-hover:text-amber-300 truncate">
                        + Google Movie Search
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate">
                        "neo noir films with twist reddit"
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 group-hover:text-white">Trigger</span>
                  </button>

                  {/* Pirate / Unindexed Stream Locker */}
                  <button
                    onClick={() => handleQuickSimulate('pirate_stream', 'Watch Blade Runner 2049 (2017) Full Movie HD 1080p Online Free | FMovies', {
                      detectedMovie: 'Blade Runner 2049 (2017)',
                      url: 'https://fmovies24.to/watch-blade-runner-2049-free.html'
                    })}
                    className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-rose-500/50 hover:bg-rose-950/20 text-left transition-all flex items-center gap-2.5 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                      <Film className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-[11px] group-hover:text-rose-300 truncate">
                        + Stream on Movie Site
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate">
                        FMovies: Blade Runner 2049
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 group-hover:text-white">Trigger</span>
                  </button>

                </div>
              </div>

              {/* Step 3: Run AI Taste Re-calculation */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-neutral-900 to-neutral-950 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>STEP 3: RECALCULATE TASTE DNA</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Runs your watch footprint through Gemini and mathematical feature ranking to generate new matches.
                  </p>
                </div>

                <button
                  onClick={() => {
                    onRefreshTaste();
                    onClose();
                  }}
                  disabled={isAnalyzing}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 whitespace-nowrap"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'Analyzing Taste...' : 'Recalculate Taste DNA'}</span>
                </button>
              </div>

              {/* Custom Event Manual Input */}
              <div className="border-t border-white/5 pt-4">
                <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-2">
                  OR ENTER A CUSTOM BROWSING EVENT
                </span>
                <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value as EventType)}
                    className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-neutral-300 focus:outline-none"
                  >
                    <option value="youtube_shorts">YouTube Shorts</option>
                    <option value="youtube">YouTube Video</option>
                    <option value="search">Google Search</option>
                    <option value="pirate_stream">Stream Locker</option>
                    <option value="official_stream">Official Stream</option>
                  </select>

                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. 'Coherence ending explained' or 'Watch Interstellar 1080p'"
                    className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                  />

                  <button
                    type="submit"
                    disabled={!customTitle.trim()}
                    className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-xs font-semibold transition-all whitespace-nowrap"
                  >
                    + Add Signal
                  </button>
                </form>
              </div>

            </div>
          ) : (
            /* Chrome Extension Setup Guide */
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase font-mono text-emerald-400">
                    REAL BROWSER TESTING IN 4 STEPS
                  </h4>
                  <span className="text-[10px] font-mono text-neutral-400">Chrome, Brave, Edge, Opera</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Test Plotted with real browsing sessions. The extension monitors YouTube videos and shorts, Google searches, and third-party movie stream player embeds, silently pushing events directly to this web app.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-neutral-950 border border-white/5 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0">1</div>
                  <div className="space-y-1">
                    <div className="font-bold text-white text-xs">Download Extension Archive</div>
                    <p className="text-[11px] text-neutral-400">
                      Click the button below to download the generated <code className="text-indigo-300">plotted-extension.zip</code>.
                    </p>
                    <button
                      onClick={onDownloadZip}
                      className="mt-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <FolderDown className="w-3.5 h-3.5" />
                      <span>Download Extension (.ZIP)</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-white/5 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0">2</div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-white text-xs">Extract the ZIP Folder</div>
                    <p className="text-[11px] text-neutral-400">
                      Unzip the file into a regular folder on your machine (e.g., in your Downloads or Projects folder).
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-white/5 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0">3</div>
                  <div className="space-y-1">
                    <div className="font-bold text-white text-xs">Load into Chrome Extensions</div>
                    <p className="text-[11px] text-neutral-400">
                      Navigate to <code className="text-indigo-300 bg-black/40 px-1.5 py-0.5 rounded">chrome://extensions</code> in your browser. Turn <strong>"Developer mode"</strong> ON (top right), then click <strong>"Load unpacked"</strong> and select the unzipped folder.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-white/5 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0">4</div>
                  <div className="space-y-1">
                    <div className="font-bold text-white text-xs">Browse & Watch Activity Stream In</div>
                    <p className="text-[11px] text-neutral-400">
                      Open a new tab to YouTube (watch any film essay or scroll Shorts), search Google for a movie, or open a movie streaming site. Look at the Plotted toolbar icon badge increment, and switch back to this dashboard to see your signals!
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-center gap-2 text-[11px] text-indigo-300">
                <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>The downloaded extension is pre-configured with the backend API address for seamless synchronizing.</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-neutral-900/60 flex items-center justify-between">
          <span className="text-[11px] font-mono text-neutral-400">
            Tip: You can switch personas or clean slate anytime
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
