import React, { useState } from 'react';
import { EventType, HistoryItem } from '../types';
import { 
  X, 
  Youtube, 
  Search, 
  Film, 
  Plus, 
  Sparkles, 
  Tv, 
  Zap,
  CheckCircle2
} from 'lucide-react';

interface CaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHistoryItem: (item: Omit<HistoryItem, 'id'>) => void;
  onRefreshTaste: () => void;
}

export const CaptureModal: React.FC<CaptureModalProps> = ({
  isOpen,
  onClose,
  onAddHistoryItem,
  onRefreshTaste
}) => {
  const [activeTab, setActiveTab] = useState<'shorts' | 'youtube' | 'search' | 'pirate'>('shorts');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [channel, setChannel] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let finalType: EventType = 'youtube';
    let defaultNotes = '';

    if (activeTab === 'shorts') {
      finalType = 'youtube_shorts';
      defaultNotes = 'Captured from YouTube Shorts scroll / cinema edit';
    } else if (activeTab === 'youtube') {
      finalType = 'youtube';
      defaultNotes = 'Captured from YouTube video essay / review';
    } else if (activeTab === 'search') {
      finalType = 'search';
      defaultNotes = 'Captured movie search query';
    } else if (activeTab === 'pirate') {
      finalType = 'pirate_stream';
      defaultNotes = 'Captured from unindexed movie streaming locker / player';
    }

    onAddHistoryItem({
      type: finalType,
      isShorts: activeTab === 'shorts',
      title: activeTab === 'search' && !title.startsWith('Search:') ? `Search: ${title.trim()}` : title.trim(),
      query: activeTab === 'search' ? title.trim() : undefined,
      url: url.trim() || undefined,
      channel: channel.trim() || undefined,
      timestamp: 'Just now',
      notes: defaultNotes
    });

    onRefreshTaste();
    setTitle('');
    setUrl('');
    setChannel('');
    onClose();
  };

  const quickPresets = [
    {
      tab: 'shorts' as const,
      label: '⚡ Short: Oppenheimer Trinity test sound design #shorts',
      title: 'Why the Oppenheimer explosion had 25 seconds of dead silence #shorts',
      url: 'https://youtube.com/shorts/oppenheimer-sound-silence',
      channel: 'CinemaEdits'
    },
    {
      tab: 'shorts' as const,
      label: '⚡ Short: 3 Mindfuck thrillers with insane plot twists #shorts',
      title: '3 Mindfuck movies with endings you will never predict #shorts',
      url: 'https://youtube.com/shorts/mindfuck-endings-recs',
      channel: 'FilmBuffShorts'
    },
    {
      tab: 'search' as const,
      label: '⚡ Search: "mind-bending psychological thrillers like Shutter Island"',
      title: 'mind-bending psychological thrillers like Shutter Island and Prisoners reddit',
      url: 'https://google.com/search?q=movies+like+shutter+island'
    },
    {
      tab: 'pirate' as const,
      label: '⚡ Stream Locker: Watched "Oldboy (2003)" on Fmovies',
      title: 'Watch Oldboy (2003) Full Movie HD Free | Fmovies',
      url: 'https://fmovies24.to/watch-oldboy-2003'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d0e17] overflow-hidden shadow-2xl space-y-5 p-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Cinzel']">
                Capture Watch & Search History
              </h3>
              <p className="text-[11px] text-neutral-400">
                Log what you watched or searched to update your Taste DNA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Context Banner */}
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-neutral-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-semibold text-white">No URLs required!</span> When you install the Chrome Extension, it captures your YouTube watch history, Shorts, and searches <span className="text-emerald-400 font-medium">100% automatically in the background</span>. Use this manual logger just to test recommendations by typing any movie, video title, or search.
          </div>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-900 rounded-xl border border-white/5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('shorts')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeTab === 'shorts'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Shorts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeTab === 'youtube'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeTab === 'search'
                ? 'bg-amber-500 text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pirate')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeTab === 'pirate'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Movie Site</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
            Quick 1-Click Test Presets:
          </span>
          <div className="space-y-1">
            {quickPresets.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveTab(qp.tab);
                  setTitle(qp.title);
                  setUrl('');
                  setChannel(qp.channel || '');
                }}
                className="w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/5 transition-all truncate"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-white/5">
          <div>
            <label className="block text-[11px] font-mono text-neutral-300 mb-1">
              {activeTab === 'shorts' && 'Short Topic or Title (e.g. "Oppenheimer audio design" or "plot twists")'}
              {activeTab === 'youtube' && 'Video Title or Film Subject (e.g. "Denis Villeneuve Dune breakdown")'}
              {activeTab === 'search' && 'Search Query (e.g. "movies like shutter island with plot twist")'}
              {activeTab === 'pirate' && 'Movie Watched (e.g. "Oldboy (2003)" or "Dune Part Two")'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                activeTab === 'shorts' ? 'e.g. Why Oppenheimer explosion had 25s dead silence #shorts' :
                activeTab === 'youtube' ? 'e.g. David Fincher Cinematography breakdown' :
                activeTab === 'search' ? 'e.g. psychological thrillers like Prisoners' :
                'e.g. Watched Dune Part 2 HD Free'
              }
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-neutral-400 mb-1">
              {activeTab === 'search' ? 'Search Engine (Optional)' : 'Channel or Source Name (Optional)'}
            </label>
            <input
              type="text"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              placeholder={activeTab === 'search' ? 'Google' : 'e.g. CinemaEdits, Thomas Flight, or Fmovies'}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Capture & Update Recs</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
