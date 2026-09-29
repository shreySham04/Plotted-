export interface NormalizedSignal {
  cleanTitle: string;
  extractedYear: number | null;
  platform: string;
  category: 'shorts' | 'essay' | 'search_intent' | 'stream_playback';
  confidence: number;
}

export class NormalizerService {
  /**
   * Sanitizes clickbait titles from pirate sites & video lockers
   */
  static sanitizeTitle(rawTitle: string): { title: string; year: number | null } {
    if (!rawTitle) return { title: 'Unknown Title', year: null };

    // Extract 4-digit release year if present (e.g. 1970 - 2029)
    const yearMatch = rawTitle.match(/\b(19\d\d|20\d\d)\b/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : null;

    let clean = rawTitle
      .replace(/watch|free|online|hd|1080p|720p|4k|full movie|download|subbed|dubbed|stream|fmovies|123movies|soap2day|putlocker|bflix/gi, ' ')
      .replace(/\|.*|-.*|–.*/, ' ') // Strip site suffix
      .replace(/\(.*?\)|\[.*?\]/g, ' ') // Strip brackets
      .replace(/\s+/g, ' ')
      .trim();

    return { title: clean || rawTitle.trim(), year };
  }

  /**
   * Deduplicates event lists based on title and timestamp proximity (5 mins)
   */
  static deduplicateEvents<T extends { title: string; timestamp?: string }>(events: T[]): T[] {
    const seen = new Map<string, number>();
    const result: T[] = [];

    for (const evt of events) {
      const normalizedTitle = evt.title.toLowerCase().trim();
      const time = evt.timestamp ? new Date(evt.timestamp).getTime() : Date.now();

      const lastSeen = seen.get(normalizedTitle);
      if (!lastSeen || Math.abs(time - lastSeen) > 300000) {
        seen.set(normalizedTitle, time);
        result.push(evt);
      }
    }

    return result;
  }

  /**
   * Categorizes raw browser event into structured intelligence feature
   */
  static categorizeEvent(type: string, url: string = '', title: string = ''): NormalizedSignal {
    const isShorts = type === 'youtube_shorts' || url.includes('/shorts/') || title.includes('#shorts');
    const isSearch = type === 'search' || url.includes('google.com/search') || url.includes('duckduckgo.com');
    const isPirate = type === 'pirate_stream' || /fmovies|123movies|soap2day|bflix|stremio/i.test(url);

    const { title: cleanTitle, year } = this.sanitizeTitle(title);

    if (isShorts) {
      return {
        cleanTitle,
        extractedYear: year,
        platform: 'YouTube Shorts',
        category: 'shorts',
        confidence: 95
      };
    }

    if (isSearch) {
      return {
        cleanTitle: cleanTitle.replace(/^Search:\s*/i, ''),
        extractedYear: year,
        platform: 'Search Engine',
        category: 'search_intent',
        confidence: 90
      };
    }

    if (isPirate) {
      return {
        cleanTitle,
        extractedYear: year,
        platform: '3rd-Party Video Locker',
        category: 'stream_playback',
        confidence: 92
      };
    }

    return {
      cleanTitle,
      extractedYear: year,
      platform: 'Streaming Platform',
      category: 'stream_playback',
      confidence: 88
    };
  }
}
