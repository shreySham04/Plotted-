import React, { useState } from 'react';
import { TasteProfile, Recommendation, HistoryItem } from '../types';
import { 
  Sparkles, 
  Film, 
  Tv,
  Bookmark, 
  BookmarkCheck, 
  Search, 
  Plus, 
  Zap, 
  Youtube, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TasteDnaDashboardProps {
  tasteProfile: TasteProfile;
  historyItems: HistoryItem[];
  watchlist: string[];
  onToggleWatchlist: (movieTitle: string) => void;
  onLiveMoodRecommend: (mood: string, customPrompt?: string) => Promise<void>;
  isGeneratingRecs: boolean;
  onOpenCaptureModal: () => void;
}

export const TasteDnaDashboard: React.FC<TasteDnaDashboardProps> = ({
  tasteProfile,
  historyItems,
  watchlist,
  onToggleWatchlist,
  onLiveMoodRecommend,
  isGeneratingRecs,
  onOpenCaptureModal
}) => {
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'movie' | 'series'>('all');
  const [customMoodInput, setCustomMoodInput] = useState<string>('');
  const [selectedMovie, setSelectedMovie] = useState<Recommendation | null>(null);

  const shortsCount = historyItems.filter(i => i.type === 'youtube_shorts' || i.isShorts).length;
  const ytCount = historyItems.filter(i => i.type === 'youtube').length;
  const searchCount = historyItems.filter(i => i.type === 'search').length;
  const pirateCount = historyItems.filter(i => i.type === 'pirate_stream').length;

  const moodPresets = [
    { id: 'all', label: 'All Vibe Curations' },
    { id: 'mindfuck', label: 'Mindfuck Thrillers' },
    { id: 'noir', label: 'Atmospheric Neo-Noir' },
    { id: 'slowburn', label: 'Slow-Burn Masterpieces' },
    { id: 'underground', label: 'Underground & Cult' },
  ];

  const filteredRecs = tasteProfile.recommendations.filter(rec => {
    // 1. Media Type Filter (Movies vs Series)
    if (mediaFilter === 'movie' && rec.mediaType === 'series') return false;
    if (mediaFilter === 'series' && rec.mediaType !== 'series') return false;

    // 2. Mood Filter
    if (selectedMood === 'all') return true;
    if (selectedMood === 'underground') return rec.isUndergroundGem;
    if (selectedMood === 'mindfuck') {
      return rec.genres.some(g => /psychological|thriller|mystery|sci-fi/i.test(g)) || rec.mood.toLowerCase().includes('mind-bending');
    }
    if (selectedMood === 'noir') {
      return rec.genres.some(g => /noir|crime|mystery/i.test(g)) || rec.mood.toLowerCase().includes('noir');
    }
    if (selectedMood === 'slowburn') {
      return rec.genres.some(g => /drama|mystery/i.test(g)) || rec.mood.toLowerCase().includes('slow');
    }
    return true;
  });

  const handleCustomMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMoodInput.trim()) return;
    onLiveMoodRecommend('Custom Search', customMoodInput.trim());
    setCustomMoodInput('');
  };

  const handleBookmarkClick = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWatchlist(title);
    if (!watchlist.includes(title)) {
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#ec4899']
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Clean Taste Archetype Hero */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-neutral-900/90 via-[#0d0e17] to-neutral-900/90 p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
                YOUR FILM TASTE ARCHETYPE
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-[11px] font-mono text-neutral-400">
                Derived from {historyItems.length} browsing signals
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Cinzel'] tracking-wide">
              {tasteProfile.tasteArchetype}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
              {tasteProfile.archetypeDescription}
            </p>

            {/* Quick Signal Pill Counters */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-300" />
                <span>{shortsCount} YouTube Shorts</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 flex items-center gap-1.5">
                <Youtube className="w-3 h-3 text-red-400" />
                <span>{ytCount} YouTube Videos</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
                <Search className="w-3 h-3 text-amber-400" />
                <span>{searchCount} Searches</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 flex items-center gap-1.5">
                <Film className="w-3 h-3 text-rose-400" />
                <span>{pirateCount} Stream Lockers</span>
              </span>
            </div>
          </div>

          <button
            onClick={onOpenCaptureModal}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 font-sans"
          >
            <Plus className="w-4 h-4" />
            <span>+ Capture History</span>
          </button>
        </div>
      </div>

      {/* Mood & Format Filters + Live Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Format Selector: All / Movies / Series */}
          <div className="flex items-center p-1 rounded-xl bg-neutral-900 border border-white/10 gap-1 text-xs shrink-0">
            <button
              onClick={() => setMediaFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                mediaFilter === 'all' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              All Formats
            </button>
            <button
              onClick={() => setMediaFilter('movie')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                mediaFilter === 'movie' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Film className="w-3 h-3" />
              <span>Movies</span>
            </button>
            <button
              onClick={() => setMediaFilter('series')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                mediaFilter === 'series' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Tv className="w-3 h-3" />
              <span>TV Series</span>
            </button>
          </div>

          {/* Mood Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {moodPresets.map((m) => {
              const isActive = selectedMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMood(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-black shadow-md'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Recommendation Prompt */}
        <form onSubmit={handleCustomMoodSubmit} className="flex items-center gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={customMoodInput}
              onChange={(e) => setCustomMoodInput(e.target.value)}
              placeholder="e.g. mind-bending series, 90s thriller..."
              className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={isGeneratingRecs || !customMoodInput.trim()}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingRecs ? 'animate-spin' : ''}`} />
            <span>{isGeneratingRecs ? 'Finding...' : 'Ask AI'}</span>
          </button>
        </form>
      </div>

      {/* Recommendations Cards Grid (Clean, readable, movie & series cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecs.map((rec) => {
          const isSaved = watchlist.includes(rec.title);
          const isSeries = rec.mediaType === 'series';

          return (
            <div
              key={rec.id}
              onClick={() => setSelectedMovie(rec)}
              className="group relative rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden flex flex-col hover:border-indigo-500/50 hover:shadow-xl transition-all cursor-pointer"
            >
              {/* Card Banner */}
              <div className={`relative h-40 w-full bg-gradient-to-br ${rec.backdropGradient} p-4 flex flex-col justify-between`}>
                <div className="absolute inset-0 bg-black/35 backdrop-blur-[0.5px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                      {rec.matchScore}% Match
                    </span>
                    {isSeries ? (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                        <Tv className="w-3 h-3 text-indigo-400" />
                        <span>{rec.seasons || 'Series'}</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-neutral-900/80 text-neutral-300 border border-white/10 text-[10px] font-mono font-semibold flex items-center gap-1">
                        <Film className="w-3 h-3 text-neutral-400" />
                        <span>Movie</span>
                      </span>
                    )}
                    {rec.isUndergroundGem && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                        Gem
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleBookmarkClick(rec.title, e)}
                    className={`p-2 rounded-lg backdrop-blur-md transition-all ${
                      isSaved ? 'bg-indigo-600 text-white' : 'bg-black/40 hover:bg-black/70 text-neutral-300'
                    }`}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative z-10">
                  <div className="text-[11px] text-neutral-300 font-mono flex items-center gap-1.5">
                    <span>{rec.year}</span>
                    <span>•</span>
                    <span>{isSeries ? (rec.creator ? `Creator: ${rec.creator}` : rec.director) : `Dir. ${rec.director}`}</span>
                    <span>•</span>
                    <span>{rec.runtime}</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-['Cinzel'] tracking-wide group-hover:text-indigo-300 transition-colors">
                    {rec.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                  {rec.overview}
                </p>

                {/* Explicit Signal Match Reason */}
                <div className="rounded-xl bg-neutral-900/90 border border-indigo-500/20 p-2.5 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 font-mono">
                    <Sparkles className="w-3 h-3" />
                    <span>WHY THIS MATCHED</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-snug">
                    {rec.whyItMatched}
                  </p>
                </div>

                {/* Where to Watch */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1">
                    <span className="text-neutral-500 font-mono">Watch:</span>
                    {rec.whereToWatch.slice(0, 2).map((w, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-300 font-mono text-[10px]">
                        {w}
                      </span>
                    ))}
                  </div>

                  <span className="text-indigo-400 font-semibold flex items-center gap-0.5 font-mono text-[11px]">
                    Details <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clean Details Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d0e17] overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                    {selectedMovie.matchScore}% Match
                  </span>
                  {selectedMovie.mediaType === 'series' ? (
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold flex items-center gap-1">
                      <Tv className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{selectedMovie.seasons || 'TV Series'}</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-xs font-mono font-semibold flex items-center gap-1">
                      <Film className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Feature Film</span>
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white font-['Cinzel'] mt-1">
                  {selectedMovie.title} ({selectedMovie.year})
                </h2>
                <p className="text-xs text-neutral-400 font-mono">
                  {selectedMovie.mediaType === 'series'
                    ? `${selectedMovie.creator ? `Created by ${selectedMovie.creator}` : `Directed by ${selectedMovie.director}`} • ${selectedMovie.runtime}`
                    : `Directed by ${selectedMovie.director} • ${selectedMovie.runtime}`}
                </p>
              </div>

              <button
                onClick={() => setSelectedMovie(null)}
                className="w-7 h-7 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {selectedMovie.overview}
            </p>

            <div className="rounded-xl bg-indigo-950/20 border border-indigo-500/30 p-3 space-y-1.5">
              <span className="text-[10px] font-bold text-indigo-300 font-mono uppercase block">
                Signal Match Reason
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {selectedMovie.whyItMatched}
              </p>
            </div>

            {selectedMovie.scoreBreakdown && (
              <div className="rounded-xl bg-black/50 border border-white/10 p-3 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase font-bold">
                  <span>Mathematical Ranking Vector</span>
                  <span className="text-indigo-400">Formula Breakdown</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-mono">
                  <div className="p-1.5 rounded bg-neutral-900 border border-white/5">
                    <span className="text-neutral-500 block">Genre (30%)</span>
                    <span className="text-neutral-200 font-bold">{selectedMovie.scoreBreakdown.genreScore}%</span>
                  </div>
                  <div className="p-1.5 rounded bg-neutral-900 border border-white/5">
                    <span className="text-neutral-500 block">Theme (20%)</span>
                    <span className="text-neutral-200 font-bold">{selectedMovie.scoreBreakdown.themeScore}%</span>
                  </div>
                  <div className="p-1.5 rounded bg-neutral-900 border border-white/5">
                    <span className="text-neutral-500 block">Director (15%)</span>
                    <span className="text-neutral-200 font-bold">{selectedMovie.scoreBreakdown.directorScore}%</span>
                  </div>
                  <div className="p-1.5 rounded bg-neutral-900 border border-white/5">
                    <span className="text-neutral-500 block">Behavior (15%)</span>
                    <span className="text-neutral-200 font-bold">{selectedMovie.scoreBreakdown.behavioralScore}%</span>
                  </div>
                  <div className="p-1.5 rounded bg-neutral-900 border border-white/5">
                    <span className="text-neutral-500 block">Novelty (10%)</span>
                    <span className="text-neutral-200 font-bold">{selectedMovie.scoreBreakdown.noveltyScore}%</span>
                  </div>
                  <div className="p-1.5 rounded bg-neutral-900 border border-white/5">
                    <span className="text-neutral-500 block">Context (10%)</span>
                    <span className="text-neutral-200 font-bold">{selectedMovie.scoreBreakdown.contextScore}%</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <span className="text-[10px] font-mono text-neutral-400 block mb-1.5">STREAMING AVAILABILITY:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedMovie.whereToWatch.map((plat, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-white/10 text-xs font-mono text-neutral-200">
                    {plat}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center gap-2">
              <button
                onClick={() => onToggleWatchlist(selectedMovie.title)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                  watchlist.includes(selectedMovie.title)
                    ? 'bg-neutral-800 text-neutral-300'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {watchlist.includes(selectedMovie.title) ? 'Saved in Watchlist' : 'Add to Watchlist'}
              </button>
              <button
                onClick={() => setSelectedMovie(null)}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
