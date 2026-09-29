import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { NormalizerService } from '../server/services/normalizer.service';

describe('NormalizerService', () => {
  it('sanitizes clickbait titles and extracts release years accurately', () => {
    const raw1 = 'Watch Cure (Kyua 1997) Full Movie HD Free Online';
    const result1 = NormalizerService.sanitizeTitle(raw1);
    assert.equal(result1.title, 'Cure');
    assert.equal(result1.year, 1997);

    const raw2 = 'Watch Dune Part Two (2024) 1080p Stream - Fmovies';
    const result2 = NormalizerService.sanitizeTitle(raw2);
    assert.equal(result2.title, 'Dune Part Two');
    assert.equal(result2.year, 2024);

    const raw3 = 'Memories of Murder [2003] BluRay English Sub | Soap2day';
    const result3 = NormalizerService.sanitizeTitle(raw3);
    assert.equal(result3.title, 'Memories of Murder');
    assert.equal(result3.year, 2003);
  });

  it('deduplicates events within 5-minute sliding window', () => {
    const now = Date.now();
    const events = [
      { id: '1', title: 'Oppenheimer', timestamp: new Date(now).toISOString() },
      { id: '2', title: 'Oppenheimer', timestamp: new Date(now - 60000).toISOString() }, // 1 min ago -> duplicate!
      { id: '3', title: 'Dune 2', timestamp: new Date(now - 120000).toISOString() },
      { id: '4', title: 'Oppenheimer', timestamp: new Date(now - 400000).toISOString() } // > 6 mins ago -> retained!
    ];

    const deduplicated = NormalizerService.deduplicateEvents(events);
    assert.equal(deduplicated.length, 3);
    assert.deepEqual(deduplicated.map(e => e.id), ['1', '3', '4']);
  });

  it('categorizes YouTube Shorts vs long-form essays vs search intent', () => {
    const shortSignal = NormalizerService.categorizeEvent(
      'youtube_shorts',
      'https://youtube.com/shorts/oppenheimer-sound-silence',
      'Oppenheimer bomb test silence explained #shorts'
    );
    assert.equal(shortSignal.category, 'shorts');
    assert.equal(shortSignal.platform, 'YouTube Shorts');

    const searchSignal = NormalizerService.categorizeEvent(
      'search',
      'https://google.com/search?q=movies+like+shutter+island',
      'Search: movies like shutter island'
    );
    assert.equal(searchSignal.category, 'search_intent');
    assert.equal(searchSignal.platform, 'Search Engine');

    const lockerSignal = NormalizerService.categorizeEvent(
      'pirate_stream',
      'https://fmovies24.to/watch-incendies-2010.html',
      'Watch Incendies 2010 Free Online'
    );
    assert.equal(lockerSignal.category, 'stream_playback');
    assert.equal(lockerSignal.platform, '3rd-Party Video Locker');
  });
});
