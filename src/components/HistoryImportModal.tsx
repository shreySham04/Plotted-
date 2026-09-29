import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { 
  X, 
  Clock, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Youtube, 
  Search, 
  Film 
} from 'lucide-react';

export type TimeframeOption = 'week' | 'month' | 'year' | 'all' | 'now';

interface HistoryImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTimeframe: (timeframe: TimeframeOption) => void;
  currentTimeframe?: TimeframeOption;
  isProcessing?: boolean;
}

export const HistoryImportModal: React.FC<HistoryImportModalProps> = ({
  isOpen,
  onClose,
  onApplyTimeframe,
  currentTimeframe = 'month',
  isProcessing = false
}) => {
  const [selected, setSelected] = useState<TimeframeOption>(currentTimeframe);

  if (!isOpen) return null;

  const options: {
    id: TimeframeOption;
    title: string;
    badge: string;
    period: string;
    description: string;
    sampleCount: string;
    recommended?: boolean;
  }[] = [
    {
      id: 'week',
      title: 'Last Week',
      badge: '7 Days',
      period: 'Past 7 Days',
      description: 'Gathers recent YouTube Shorts, trailers, and searches you made this week.',
      sampleCount: '~12 - 25 signals'
    },
    {
      id: 'month',
      title: 'Last Month',
      badge: 'Recommended',
      period: 'Past 30 Days',
      description: 'Ideal balance: gathers sufficient director essays, plot queries, and recent streaming habits.',
      sampleCount: '~40 - 90 signals',
      recommended: true
    },
    {
      id: 'year',
      title: 'Last Year',
      badge: '365 Days',
      period: 'Past 1 Year',
      description: 'Comprehensive historical footprint: uncovers your recurring cinematic obsessions and seasonal genres.',
      sampleCount: '~200 - 500 signals'
    },
    {
      id: 'all',
      title: 'All Time',
      badge: 'Full Archive',
      period: 'Entire History',
      description: 'Scans every available YouTube video, short, movie search, and stream locker session on this browser.',
      sampleCount: 'Up to 5,000 signals'
    },
    {
      id: 'now',
      title: 'From Now On',
      badge: 'Clean Slate',
      period: 'Real-time Only',
      description: 'Skip past history entirely. Plotted starts with a blank canvas and monitors only future visits.',
      sampleCount: '0 past signals (real-time)'
    }
  ];

  const handleConfirm = () => {
    onApplyTimeframe(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-2xl bg-[#09090b] border border-white/10 p-6 shadow-2xl space-y-5 text-left relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white font-['Cinzel'] tracking-wide">
                Gather Previous History
              </h3>
            </div>
            <p className="text-xs text-neutral-400">
              Choose how far back Plotted should gather your browsing footprint to build your Taste Profile.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Extension Info Banner */}
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-neutral-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="text-white">100% Local & Privacy-Preserved:</strong> In the Chrome Extension, history scanning runs completely inside your browser via <code className="text-indigo-300">chrome.history</code>. No raw browser logs are sold or stored externally.
          </div>
        </div>

        {/* Timeframe Options List */}
        <div className="space-y-2">
          {options.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-indigo-950/50 border-indigo-500/80 shadow-md shadow-indigo-950/50'
                    : 'bg-neutral-900/60 hover:bg-neutral-900 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-4 h-4 rounded-full mt-0.5 shrink-0 flex items-center justify-center border transition-all ${
                    isSelected ? 'border-indigo-400 bg-indigo-500' : 'border-neutral-600 bg-transparent'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">{opt.title}</span>
                      <span className={`text-[10px] px-2 py-0.2 rounded font-mono font-medium ${
                        opt.recommended
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] font-mono text-neutral-500">{opt.sampleCount}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-white/5">
          <span className="text-[11px] font-mono text-neutral-400">
            Selected: <strong className="text-indigo-300">{options.find(o => o.id === selected)?.title}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white border border-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 font-mono disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Gathering & Computing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{selected === 'now' ? 'Start From Now On' : 'Gather & Compute Taste DNA'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
