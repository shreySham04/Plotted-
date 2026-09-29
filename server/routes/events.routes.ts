import { Router, Request, Response } from 'express';
import { validateBody, IngestEventsSchema } from '../middleware/validate';
import { NormalizerService } from '../services/normalizer.service';

const router = Router();

// In-memory shared event store across extension and dashboard
interface IngestedEvent {
  id: string;
  type: 'youtube' | 'youtube_shorts' | 'search' | 'pirate_stream' | 'official_stream';
  title: string;
  query?: string;
  url?: string;
  channel?: string;
  duration?: string;
  timestamp: string;
  notes?: string;
  isShorts?: boolean;
}

let eventStore: IngestedEvent[] = [
  {
    id: 'evt-shorts-1',
    type: 'youtube_shorts',
    isShorts: true,
    title: 'The chilling silence in Oppenheimer bomb test scene explained #shorts',
    channel: 'CinemaEdits',
    duration: '0:54',
    url: 'https://youtube.com/shorts/oppenheimer-silence-edit',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    notes: 'Captured from YouTube Shorts cinema feed. Sound design breakdown.'
  },
  {
    id: 'evt-1',
    type: 'youtube',
    title: 'Why Denis Villeneuve Is The Modern Master of Tension (Video Essay)',
    channel: 'Thomas Flight',
    duration: '18:42',
    url: 'https://youtube.com/watch?v=dv-tension-mastery',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    notes: 'Completed full watch. Focus on Sicario and Prisoners pacing.'
  },
  {
    id: 'evt-shorts-2',
    type: 'youtube_shorts',
    isShorts: true,
    title: '3 Mindfuck movies with endings you will never predict #shorts',
    channel: 'FilmBuffShorts',
    duration: '0:42',
    url: 'https://youtube.com/shorts/mindfuck-endings-recs',
    timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    notes: 'Referenced Incendies and Coherence.'
  },
  {
    id: 'evt-2',
    type: 'pirate_stream',
    title: 'Watch Cure (Kyua 1997) Full Movie HD Free Online',
    url: 'https://fmovies24.to/watch-cure-1997-free.html',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    notes: 'Plotted DOM observer caught HTML5 video stream on unindexed host.'
  },
  {
    id: 'evt-3',
    type: 'search',
    title: 'Search: movies with unreliable narrator and shocking plot twist reddit',
    query: 'movies with unreliable narrator and shocking plot twist reddit',
    url: 'https://www.google.com/search?q=movies+with+unreliable+narrator+and+shocking+plot+twist+reddit',
    timestamp: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    notes: 'Read top Reddit recommendation threads.'
  }
];

/**
 * GET /api/events
 * Retrieves current centralized event stream
 */
router.get('/', (_req: Request, res: Response) => {
  res.json({
    count: eventStore.length,
    events: eventStore
  });
});

/**
 * POST /api/events
 * Ingests new events from Chrome Extension or Web Companion
 */
router.post('/', validateBody(IngestEventsSchema), (req: Request, res: Response) => {
  const incomingEvents: IngestedEvent[] = req.body.events.map((e: any) => ({
    ...e,
    id: e.id || 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: e.timestamp || new Date().toISOString()
  }));

  // Combine and deduplicate
  const combined = [...incomingEvents, ...eventStore];
  eventStore = NormalizerService.deduplicateEvents(combined).slice(0, 300);

  res.status(201).json({
    status: 'success',
    ingestedCount: incomingEvents.length,
    totalCount: eventStore.length
  });
});

/**
 * DELETE /api/events
 * Clears event store
 */
router.delete('/', (_req: Request, res: Response) => {
  eventStore = [];
  res.json({ status: 'success', message: 'Event store cleared' });
});

export default router;
