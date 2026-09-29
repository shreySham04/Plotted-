import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EventSchema, IngestEventsSchema, TasteProfileSchema } from '../server/middleware/validate';

describe('Validation Schemas (Zod)', () => {
  it('validates correct YouTube Shorts & stream locker events', () => {
    const validEvent = {
      type: 'youtube_shorts',
      title: 'Oppenheimer Sound Design breakdown in 60s #shorts',
      url: 'https://youtube.com/shorts/oppenheimer-sound',
      channel: 'CinemaEdits',
      isShorts: true
    };

    const parseResult = EventSchema.safeParse(validEvent);
    assert.equal(parseResult.success, true);
  });

  it('rejects events with invalid types or empty titles', () => {
    const invalidEvent = {
      type: 'invalid_streaming_type',
      title: ''
    };

    const parseResult = EventSchema.safeParse(invalidEvent);
    assert.equal(parseResult.success, false);
  });

  it('validates batch ingestion payload with size limits', () => {
    const batch = {
      events: [
        { type: 'youtube', title: 'Why Denis Villeneuve is a master of tension' },
        { type: 'search', title: 'Search: movies with twist endings reddit' }
      ]
    };

    const parseResult = IngestEventsSchema.safeParse(batch);
    assert.equal(parseResult.success, true);

    const emptyBatch = { events: [] };
    const emptyResult = IngestEventsSchema.safeParse(emptyBatch);
    assert.equal(emptyResult.success, false); // min 1 required
  });

  it('validates structured TasteProfileSchema', () => {
    const validProfile = {
      tasteArchetype: 'The Existential Puzzle-Solver',
      archetypeDescription: 'Focuses on non-linear mind-bending thrillers.',
      tasteDna: {
        genres: [{ name: 'Psychological Thriller', percentage: 40 }],
        themes: ['Unreliable Narrators'],
        directors: ['Denis Villeneuve']
      },
      recommendations: [
        {
          id: 'rec-1',
          title: 'Incendies',
          year: 2010,
          director: 'Denis Villeneuve',
          matchScore: 98,
          genres: ['Mystery', 'Drama'],
          overview: 'Family secrets in the Middle East.',
          whyItMatched: 'Matched your Villeneuve video essay watch.',
          triggerSignals: ['YouTube: Tension essay'],
          mood: 'Devastating',
          rating: '8.3/10 IMDb',
          runtime: '131 min',
          whereToWatch: ['Prime Video'],
          isUndergroundGem: false
        }
      ]
    };

    const result = TasteProfileSchema.safeParse(validProfile);
    assert.equal(result.success, true);
  });
});
