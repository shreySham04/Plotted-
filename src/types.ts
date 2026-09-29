export type EventType = 'youtube' | 'youtube_shorts' | 'search' | 'pirate_stream' | 'official_stream';

export interface HistoryItem {
  id: string;
  type: EventType;
  title: string;
  query?: string;
  url?: string;
  channel?: string;
  duration?: string;
  timestamp: string;
  notes?: string;
  detectedMovie?: string;
  isShorts?: boolean;
}

export interface Recommendation {
  id: string;
  title: string;
  year: number;
  director: string;
  matchScore: number;
  genres: string[];
  posterDescription: string;
  backdropGradient: string;
  overview: string;
  whyItMatched: string;
  triggerSignals: string[];
  mood: string;
  rating: string;
  runtime: string;
  whereToWatch: string[];
  isUndergroundGem: boolean;
}

export interface TasteDna {
  genres: Array<{ name: string; percentage: number }>;
  themes: string[];
  directors: string[];
  pacingPreference: string;
  visualStyle: string;
}

export interface CapturedSignalsSummary {
  totalEvents: number;
  youtubeHighlights: string[];
  searchHighlights: string[];
  pirateStreamHighlights: string[];
  hiddenAffinitiesFound: string;
}

export interface TasteProfile {
  tasteArchetype: string;
  archetypeDescription: string;
  tasteDna: TasteDna;
  capturedSignalsSummary: CapturedSignalsSummary;
  recommendations: Recommendation[];
}

export interface StreamDetectionResult {
  isMovie: boolean;
  detectedType: EventType | 'other';
  cleanTitle: string;
  year: number | null;
  confidence: number;
  platformLabel: string;
  evidence: string;
}
