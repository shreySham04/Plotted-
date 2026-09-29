import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const EventSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['youtube', 'youtube_shorts', 'search', 'pirate_stream', 'official_stream']),
  title: z.string().min(1).max(500),
  query: z.string().max(500).optional(),
  url: z.string().url().or(z.string().max(1000)).optional(),
  channel: z.string().max(200).optional(),
  duration: z.string().max(50).optional(),
  timestamp: z.string().optional(),
  notes: z.string().max(500).optional(),
  isShorts: z.boolean().optional(),
  detectedMovie: z.string().max(200).optional()
});

export const IngestEventsSchema = z.object({
  events: z.array(EventSchema).min(1).max(200)
});

export const AnalyzeTasteSchema = z.object({
  historyItems: z.array(EventSchema).max(500)
});

export const GenreSchema = z.object({
  name: z.string(),
  percentage: z.number()
});

export const TasteDnaSchema = z.object({
  genres: z.array(GenreSchema),
  themes: z.array(z.string()),
  directors: z.array(z.string()),
  pacingPreference: z.string().optional(),
  visualStyle: z.string().optional()
});

export const ScoreBreakdownSchema = z.object({
  genreScore: z.number(),
  themeScore: z.number(),
  directorScore: z.number(),
  behavioralScore: z.number(),
  noveltyScore: z.number(),
  contextScore: z.number()
}).optional();

export const RecommendationSchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.number(),
  director: z.string(),
  matchScore: z.number(),
  scoreBreakdown: ScoreBreakdownSchema,
  genres: z.array(z.string()),
  posterDescription: z.string().optional(),
  backdropGradient: z.string().optional(),
  overview: z.string(),
  whyItMatched: z.string(),
  triggerSignals: z.array(z.string()),
  mood: z.string(),
  rating: z.string(),
  runtime: z.string(),
  whereToWatch: z.array(z.string()),
  isUndergroundGem: z.boolean()
});

export const TasteProfileSchema = z.object({
  tasteArchetype: z.string(),
  archetypeDescription: z.string(),
  tasteDna: TasteDnaSchema,
  capturedSignalsSummary: z.object({
    totalEvents: z.number(),
    youtubeHighlights: z.array(z.string()),
    searchHighlights: z.array(z.string()),
    pirateStreamHighlights: z.array(z.string()),
    hiddenAffinitiesFound: z.string()
  }).optional(),
  recommendations: z.array(RecommendationSchema)
});

export const RecommendLiveSchema = z.object({
  mood: z.string().max(100).optional(),
  customPrompt: z.string().max(500).optional(),
  tasteProfile: TasteProfileSchema.optional()
});

export const DetectStreamSchema = z.object({
  url: z.string().max(1000).optional(),
  pageTitle: z.string().max(500).optional(),
  domSnippet: z.string().max(5000).optional()
});

export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: result.error.issues.map((e: z.ZodIssue) => ({ field: e.path.join('.'), message: e.message }))
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
