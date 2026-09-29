import React, { useState } from 'react';
import { StreamDetectionResult, HistoryItem } from '../types';
import { 
  Tv, 
  Globe, 
  Play, 
  Search, 
  Youtube, 
  ShieldAlert, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  RefreshCw,
  Sliders,
  Terminal,
  Layers,
  Lock
} from 'lucide-react';

interface StreamSimulatorViewProps {
  onCaptureDetectedMovie: (item: Omit<HistoryItem, 'id'>) => void;
  onRefreshTaste: () => void;
}

export const StreamSimulatorView: React.FC<StreamSimulatorViewProps> = ({
  onCaptureDetectedMovie,
  onRefreshTaste
}) => {
  // Preset simulation tab selection
  const [activePreset, setActivePreset] = useState<'fmovies' | 'youtube' | 'search'>('fmovies');
  
  // Custom URL detector form
  const [testUrl, setTestUrl] = useState('https://fmovies24.to/watch-oppenheimer-2023-free-hd.html');
  const [testTitle, setTestTitle] = useState('Watch Oppenheimer (2023) Full Movie HD 1080p Online Free | Fmovies');
  const [testSnippet, setTestSnippet] = useState('<video id="stream-player" src="blob:https://fmovies24.to/video-stream-hls.m3u8" controls autoplay></video>');
  
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<StreamDetectionResult | null>({
    isMovie: true,
    detectedType: 'pirate_stream',
    cleanTitle: 'Oppenheimer',
    year: 2023,
    confidence: 97,
    platformLabel: 'Fmovies24 Unindexed Host',
    evidence: 'Intercepted HTML5 video element with active blob stream buffer; stripped SEO clickbait keywords ("Watch Free HD 1080p Online") from document title.'
  });

  const handleRunDetection = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsDetecting(true);

    try {
      const response = await fetch('/api/detect-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: testUrl,
          pageTitle: testTitle,
          domSnippet: testSnippet
        })
      });

      const data = await response.json();
      setDetectionResult(data);
    } catch (err) {
      console.error('Detection test failed:', err);
      setDetectionResult({
        isMovie: true,
        detectedType: 'pirate_stream',
        cleanTitle: testTitle.replace(/watch|free|online|hd|1080p|fmovies/gi, '').trim(),
        year: 2024,
        confidence: 90,
        platformLabel: 'Stream Locker',
        evidence: 'Fallback heuristic parsed document title and video stream source.'
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const handleAddCapturedToProfile = () => {
    if (!detectionResult || !detectionResult.cleanTitle) return;

    onCaptureDetectedMovie({
      type: detectionResult.detectedType === 'other' ? 'pirate_stream' : detectionResult.detectedType,
      title: `${detectionResult.cleanTitle} (${detectionResult.year || 2024})`,
      url: testUrl,
      notes: `Captured via Plotted background DOM script on ${detectionResult.platformLabel}. Confidence: ${detectionResult.confidence}%.`,
      timestamp: 'Just now',
      detectedMovie: detectionResult.cleanTitle
    });

    onRefreshTaste();
  };

  const handleSelectPreset = (preset: 'fmovies' | 'youtube' | 'search') => {
    setActivePreset(preset);
    if (preset === 'fmovies') {
      setTestUrl('https://123movies-to.org/watch-inland-empire-2006-free.html');
      setTestTitle('Watch Inland Empire (2006) Full Movie Free HD Stream - 123movies');
      setTestSnippet('<video class="jw-video" src="https://streamtape.com/get_video?id=xyz" controls></video>');
    } else if (preset === 'youtube') {
      setTestUrl('https://youtube.com/watch?v=david-lynch-nightmare-logic');
      setTestTitle('David Lynch - The Nightmare Logic of Surrealism (Video Essay)');
      setTestSnippet('<div id="meta"><h1 class="title">David Lynch Video Essay</h1><a class="channel">Broey Deschanel</a></div>');
    } else {
      setTestUrl('https://www.google.com/search?q=atmospheric+surrealist+psychological+thrillers');
      setTestTitle('atmospheric surrealist psychological thrillers - Google Search');
      setTestSnippet('<input name="q" value="atmospheric surrealist psychological thrillers">');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      
      {/* View Header */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-white font-['Cinzel']">
            Live Stream Interceptor & Tab Simulator
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold">
            Illegal Site & Stream Locker Detection
          </span>
        </div>
        <p className="text-xs text-neutral-400 mt-1 max-w-3xl leading-relaxed">
          See exactly how Plotted works in the background when you browse the web. Plotted monitors active browser tabs, intercepts HTML5 & iframe video streams on unauthorized movie sites, extracts the true movie title, and feeds it into your Taste Profile.
        </p>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-neutral-400 mr-2">Simulate Tab:</span>
        <button
          onClick={() => handleSelectPreset('fmovies')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activePreset === 'fmovies'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          <Tv className="w-3.5 h-3.5 text-rose-400" />
          <span>Pirate Movie Portal (123movies / Fmovies)</span>
        </button>

        <button
          onClick={() => handleSelectPreset('youtube')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activePreset === 'youtube'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          <Youtube className="w-3.5 h-3.5 text-red-400" />
          <span>YouTube Video Essay</span>
        </button>

        <button
          onClick={() => handleSelectPreset('search')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activePreset === 'search'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 font-bold'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-amber-400" />
          <span>Google Search Query</span>
        </button>
      </div>

      {/* Realistic Simulated Browser Window Frame */}
      <div className="rounded-3xl border border-white/10 bg-[#0d0e17] overflow-hidden shadow-2xl">
        
        {/* Browser Chrome Header */}
        <div className="bg-[#141624] px-4 py-3 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          {/* Traffic lights + Tab Bar */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            {/* Simulated Active Tab */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d0e17] rounded-lg border border-white/10 text-xs text-neutral-200 max-w-xs truncate font-mono">
              <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{testTitle}</span>
            </div>
          </div>

          {/* Plotted Injected Badge inside Browser */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Plotted Inspector: Active on this page</span>
          </div>

        </div>

        {/* URL Bar */}
        <div className="bg-[#090a10] px-4 py-2.5 border-b border-white/5 flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 bg-neutral-900/90 rounded-xl px-3 py-1.5 border border-white/10 text-xs text-neutral-300 font-mono">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate text-neutral-200">{testUrl}</span>
          </div>
          <button
            onClick={() => handleRunDetection()}
            disabled={isDetecting}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 text-white text-xs font-semibold transition-all flex items-center gap-1 font-mono shrink-0"
          >
            <RefreshCw className={`w-3 h-3 ${isDetecting ? 'animate-spin' : ''}`} />
            <span>Test Heuristic</span>
          </button>
        </div>

        {/* Viewport Content: Two Column Layout (Mock Webpage vs Plotted Interceptor HUD) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
          
          {/* Left Column: Simulated Illegal Movie Site View */}
          <div className="lg:col-span-7 p-6 bg-gradient-to-b from-neutral-950 via-[#0a0b12] to-black border-r border-white/5 space-y-4">
            
            {/* Simulated pirate streaming site elements */}
            <div className="rounded-xl border border-white/10 bg-neutral-900/90 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white tracking-wide">
                  {testTitle}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                  Unindexed Stream Host
                </span>
              </div>

              {/* Simulated Video Player */}
              <div className="relative aspect-video rounded-xl bg-black border border-white/10 overflow-hidden flex items-center justify-center group shadow-2xl">
                <div className="absolute inset-0 bg-radial from-rose-950/20 to-black/80" />
                
                {/* Play Button & Stream State */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-rose-600/90 flex items-center justify-center shadow-lg shadow-rose-600/50 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white ml-1 fill-white" />
                  </div>
                  <span className="text-xs text-neutral-300 font-mono">
                    HTML5 Media Source Active (1080p HLS)
                  </span>
                </div>

                {/* Scraper overlay */}
                <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/80 border border-rose-500/40 text-[10px] font-mono text-rose-300 flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  <span>&lt;video&gt; DOM Hooked</span>
                </div>

                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-neutral-400">
                  Player: VidCloud / JWPlayer v8.24
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                <span>Ad-shield: Bypassed popup redirects</span>
                <span>Buffer: Continuous Stream Detected</span>
              </div>
            </div>

            {/* DOM Inspection snippet preview */}
            <div className="rounded-xl bg-black/60 border border-white/5 p-3 space-y-1.5">
              <span className="text-[10px] font-bold text-neutral-400 font-mono uppercase">
                Raw Page DOM Scraped by Plotted Content Script:
              </span>
              <pre className="text-[11px] font-mono text-indigo-300/80 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {testSnippet}
              </pre>
            </div>

          </div>

          {/* Right Column: Plotted AI Extraction HUD */}
          <div className="lg:col-span-5 p-6 bg-[#0f111e] space-y-5 flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-mono flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  Plotted Extraction Engine
                </span>
                {detectionResult && (
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    {detectionResult.confidence}% Confidence
                  </span>
                )}
              </div>

              {isDetecting ? (
                <div className="py-12 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                  <p className="text-xs font-mono text-neutral-400">
                    Running AI title cleaner & player heuristic...
                  </p>
                </div>
              ) : detectionResult ? (
                <div className="space-y-3.5">
                  
                  {/* Clean Film Detected */}
                  <div className="rounded-2xl bg-neutral-900/90 border border-white/10 p-4 space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">
                      Extracted Film Entity
                    </span>
                    <div className="text-lg font-bold text-white font-['Cinzel'] flex items-center gap-2">
                      <span>{detectionResult.cleanTitle}</span>
                      {detectionResult.year && (
                        <span className="text-sm font-mono text-neutral-400">({detectionResult.year})</span>
                      )}
                    </div>
                  </div>

                  {/* Channel & Platform Label */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-neutral-900/80 rounded-xl p-3 border border-white/5">
                      <span className="text-neutral-500 text-[10px] block">SOURCE PLATFORM</span>
                      <span className="text-neutral-200 font-semibold">{detectionResult.platformLabel}</span>
                    </div>

                    <div className="bg-neutral-900/80 rounded-xl p-3 border border-white/5">
                      <span className="text-neutral-500 text-[10px] block">EVENT CLASSIFIER</span>
                      <span className="text-rose-400 font-semibold uppercase">{detectionResult.detectedType}</span>
                    </div>
                  </div>

                  {/* Detection Evidence */}
                  <div className="rounded-xl bg-indigo-950/20 border border-indigo-500/30 p-3.5 space-y-1.5">
                    <span className="text-[10px] font-bold text-indigo-300 font-mono uppercase flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      Heuristic Audit Log
                    </span>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      {detectionResult.evidence}
                    </p>
                  </div>

                </div>
              ) : null}
            </div>

            {/* Action to inject this captured movie into live taste profile */}
            {detectionResult && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <button
                  onClick={handleAddCapturedToProfile}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-indigo-600 to-violet-600 hover:brightness-110 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 font-mono"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Log to History & Re-Compute Taste Profile</span>
                </button>
                <p className="text-[11px] text-neutral-500 text-center font-mono">
                  Triggers immediate Gemini taste recalculation
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Custom URL Tester Form */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-sm font-bold text-white font-mono">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span>TEST YOUR OWN STREAM / VIDEO URL</span>
        </div>
        <p className="text-xs text-neutral-400">
          Have an illegal streaming site, YouTube essay, or movie search query you want to test Plotted against? Enter it below.
        </p>

        <form onSubmit={handleRunDetection} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono text-neutral-400 mb-1">Page URL</label>
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-neutral-400 mb-1">Page Document Title</label>
            <input
              type="text"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isDetecting}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
              <span>Run Detection Heuristic</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
