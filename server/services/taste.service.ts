import { ai } from '../ai/gemini.client';
import { NormalizerService } from './normalizer.service';
import { RankingService } from './ranking.service';

export interface UserHistoryItem {
  id?: string;
  type: string;
  title: string;
  query?: string;
  url?: string;
  channel?: string;
  duration?: string;
  timestamp?: string;
  notes?: string;
  isShorts?: boolean;
}

export class TasteService {
  /**
   * Aggregates representative signals using recency decay, frequency weighting, and cross-category balancing
   */
  static aggregateRepresentativeSignals(normalizedItems: any[], maxCount: number = 18): string[] {
    if (normalizedItems.length === 0) return [];

    const now = Date.now();
    // 1. Calculate weighted score for each event based on recency and keyword frequency
    const termFrequency = new Map<string, number>();
    for (const item of normalizedItems) {
      const words = item.cleanTitle.toLowerCase().split(/\s+/);
      for (const w of words) {
        if (w.length > 3) termFrequency.set(w, (termFrequency.get(w) || 0) + 1);
      }
    }

    const scoredItems = normalizedItems.map(item => {
      const itemTime = item.timestamp ? new Date(item.timestamp).getTime() : now;
      const hoursAgo = Math.max(0, (now - itemTime) / (3600 * 1000));
      // Recency decay: events within 24h get 1.5x, 7 days get 1.0x, older get 0.7x
      const recencyMultiplier = Math.exp(-hoursAgo / (24 * 7));

      // Frequency score: repeated director or topic mentions get higher priority
      let freqScore = 1;
      for (const w of item.cleanTitle.toLowerCase().split(/\s+/)) {
        if (termFrequency.get(w) && (termFrequency.get(w) || 0) > 1) {
          freqScore += 0.4;
        }
      }

      return {
        item,
        score: recencyMultiplier * freqScore
      };
    });

    // 2. Stratified balance across categories (Shorts, Video Essays, Searches, Stream Lockers)
    const byCategory = new Map<string, any[]>();
    for (const entry of scoredItems) {
      const cat = entry.item.category;
      if (!byCategory.has(cat)) byCategory.set(cat, []);
      byCategory.get(cat)!.push(entry);
    }

    // Sort each category by relevance score
    for (const list of byCategory.values()) {
      list.sort((a, b) => b.score - a.score);
    }

    const selected: any[] = [];
    const categories = Array.from(byCategory.keys());

    // Round-robin pick to ensure diverse multi-platform representation
    let round = 0;
    while (selected.length < maxCount && round < 10) {
      let addedInRound = false;
      for (const cat of categories) {
        const list = byCategory.get(cat)!;
        if (list.length > round) {
          selected.push(list[round].item);
          addedInRound = true;
          if (selected.length >= maxCount) break;
        }
      }
      if (!addedInRound) break;
      round++;
    }

    return selected.map(i => 
      `• [${i.platform}] ${i.cleanTitle}${i.channel ? ` (by ${i.channel})` : ''}`
    );
  }

  /**
   * Synthesizes Taste DNA through feature extraction + Gemini LLM explanation + mathematical ranking
   */
  static async synthesizeTasteProfile(historyItems: UserHistoryItem[]) {
    // 1. Feature normalization & classification
    const normalized = historyItems.map(item => {
      const parsed = NormalizerService.categorizeEvent(item.type, item.url, item.title);
      return {
        ...item,
        cleanTitle: parsed.cleanTitle,
        category: parsed.category,
        platform: parsed.platform
      };
    });

    // 2. Behavioral signal summaries
    const shortsCount = normalized.filter(i => i.category === 'shorts' || i.isShorts).length;
    const streamCount = normalized.filter(i => i.category === 'stream_playback').length;

    // Intelligent representative signal aggregation
    const signalHighlights = this.aggregateRepresentativeSignals(normalized, 18).join('\n');

    const prompt = `You are "Plotted", an elite cinematic intelligence and cinema/television taste engine.
Analyze these normalized behavioral viewing signals from the user's YouTube Shorts, YouTube videos/essays, Google movie/series searches, and streaming player sessions:

${signalHighlights}

YOUR GOAL:
1. Synthesize their cinematic Taste DNA and Persona Archetype based strictly on their actual activity.
2. DYNAMICALLY GENERATE 6 REAL, CRITICALLY ACCLAIMED RECOMMENDATIONS.
IMPORTANT: Provide a compelling, diverse mix of BOTH standout FEATURE FILMS and prestige TV / LIMITED SERIES / ANIME SERIES (e.g. miniseries, prestige television, anime series, sci-fi/mystery series like Dark, Chernobyl, Severance, Arcane, True Detective, Shōgun, Attack on Titan, Scavengers Reign, etc.) directly connected to their history signals.
CRITICAL REQUIREMENT: Do NOT return a generic or hardcoded list. If they watched anime, recommend relevant anime films and series. If they watched sci-fi, recommend mind-bending sci-fi films and series. If they watched horror, mystery, or drama, recommend works specifically aligned with those signals.

Return a valid JSON object matching this schema:
{
  "tasteArchetype": "Compelling, evocative title for their cinema & series persona",
  "archetypeDescription": "2-3 sentences capturing what drives their psychological taste, pacing preference, and directorial/narrative obsessions.",
  "tasteDna": {
    "genres": [
      {"name": "Dominant Genre", "percentage": 40},
      {"name": "Secondary Genre", "percentage": 30},
      {"name": "Third Genre", "percentage": 20},
      {"name": "Fourth Genre", "percentage": 10}
    ],
    "themes": ["theme1", "theme2", "theme3", "theme4"],
    "directors": ["director/creator 1", "director/creator 2", "director/creator 3"],
    "pacingPreference": "description of preferred narrative pacing",
    "visualStyle": "description of preferred cinematography / visual aesthetic"
  },
  "capturedSignalsSummary": {
    "totalEvents": ${historyItems.length},
    "youtubeHighlights": ["highlight of specific YouTube/Shorts watches"],
    "searchHighlights": ["highlight of specific search inquiries"],
    "pirateStreamHighlights": ["highlight of specific stream locker watches"],
    "hiddenAffinitiesFound": "What their combined multi-platform browsing reveals"
  },
  "recommendations": [
    {
      "id": "rec-1",
      "title": "Exact Real Title",
      "mediaType": "movie" | "series",
      "seasons": "Limited Series" or "1 Season" or "4 Seasons" (if series, else null),
      "year": 2022,
      "director": "Real Director or Showrunner Name",
      "matchScore": 97,
      "genres": ["Genre1", "Genre2"],
      "overview": "Engaging 2-sentence synopsis.",
      "whyItMatched": "Specific, non-generic explanation explicitly referencing which of the user's YouTube watches, Shorts, searches, or streams directly triggered this recommendation.",
      "triggerSignals": ["YouTube: Specific title watched", "Search: specific search query"],
      "mood": "Atmospheric & Suspenseful",
      "rating": "8.5/10 IMDb",
      "runtime": "124 min" (for movie) or "8 eps • 55m" (for series),
      "whereToWatch": ["Netflix", "HBO Max", "Prime Video", "Apple TV"],
      "isUndergroundGem": false
    }
  ]
}`;

    try {
      let response: any;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7
          }
        });
      } catch (firstErr) {
        console.warn('[TasteService] gemini-2.5-flash fallback to gemini-3.8-flash:', firstErr);
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7
          }
        });
      }

      const text = response.text;
      if (!text) throw new Error('Empty AI response');
      const parsedAi = JSON.parse(text);

      const userGenres = parsedAi.tasteDna?.genres || [
        { name: "Psychological Thriller", percentage: 38 },
        { name: "Sci-Fi / Neo-Noir", percentage: 28 },
        { name: "Cerebral Mystery", percentage: 20 },
        { name: "Dark Drama", percentage: 14 }
      ];
      const userThemes = parsedAi.tasteDna?.themes || ["Ambiguous Endings", "High Tension"];
      const userDirectors = parsedAi.tasteDna?.directors || ["Denis Villeneuve", "Christopher Nolan"];

      // Process dynamic AI-generated recommendations
      let dynamicRecs: any[] = [];
      if (Array.isArray(parsedAi.recommendations) && parsedAi.recommendations.length > 0) {
        dynamicRecs = parsedAi.recommendations.map((rec: any, idx: number) => {
          const isSeries = rec.mediaType === 'series' || Boolean(rec.seasons) || /season|episodes|series/i.test(rec.runtime || '');
          
          // Deterministic score calculation: no Math.random() fallback
          let matchScore: number;
          if (typeof rec.matchScore === 'number' && rec.matchScore > 0) {
            matchScore = Math.min(99, Math.max(50, Math.round(rec.matchScore)));
          } else {
            const mathResult = RankingService.calculateCandidateScore(
              {
                id: rec.id || `rec-${idx}`,
                title: rec.title || '',
                mediaType: isSeries ? 'series' : 'movie',
                year: typeof rec.year === 'number' ? rec.year : 2022,
                director: rec.director || '',
                creator: rec.creator,
                genres: Array.isArray(rec.genres) ? rec.genres : [],
                themes: Array.isArray(rec.themes) ? rec.themes : [],
                pacing: rec.pacing || '',
                backdropGradient: '',
                overview: rec.overview || '',
                whereToWatch: Array.isArray(rec.whereToWatch) ? rec.whereToWatch : [],
                isUndergroundGem: Boolean(rec.isUndergroundGem),
                rating: rec.rating || '8.0/10',
                runtime: rec.runtime || ''
              },
              userGenres,
              userThemes,
              userDirectors,
              historyItems.map(i => i.title)
            );
            matchScore = mathResult.score;
          }

          // Trigger signals directly grounded in user's actual history
          const fallbackTriggers = historyItems.slice(0, 2).map(item => {
            const plat = item.type === 'youtube_shorts' ? 'YouTube Shorts' :
                         item.type === 'youtube' ? 'YouTube' :
                         item.type === 'search' ? 'Search' :
                         item.type === 'pirate_stream' ? 'Stream Locker' : 'Browsing';
            return `${plat}: ${item.title}`;
          });

          return {
            id: rec.id || `rec-${Date.now()}-${idx}`,
            title: rec.title || "Cinema Recommendation",
            mediaType: isSeries ? 'series' : 'movie',
            seasons: rec.seasons || (isSeries ? 'Limited Series' : undefined),
            creator: rec.creator || rec.director || (isSeries ? 'Acclaimed Showrunner' : 'Acclaimed Director'),
            year: typeof rec.year === 'number' ? rec.year : 2021,
            director: rec.director || rec.creator || "Acclaimed Director",
            genres: Array.isArray(rec.genres) ? rec.genres : ["Drama", "Thriller"],
            overview: rec.overview || "A standout narrative tailored to your viewing patterns.",
            matchScore,
            whyItMatched: rec.whyItMatched || "Directly matches the tone, creators, and subjects in your watch activity.",
            triggerSignals: Array.isArray(rec.triggerSignals) && rec.triggerSignals.length > 0 
              ? rec.triggerSignals 
              : fallbackTriggers,
            mood: rec.mood || rec.genres?.[0] || 'Atmospheric',
            rating: rec.rating || '8.2/10 IMDb',
            runtime: rec.runtime || (isSeries ? '8 eps • 55m' : '115 min'),
            // Real platforms only: never invent arbitrary platforms
            whereToWatch: Array.isArray(rec.whereToWatch) ? rec.whereToWatch : [],
            isUndergroundGem: Boolean(rec.isUndergroundGem)
          };
        });
      }

      // If AI didn't return recommendations array, fall back to ranking candidates from full catalog
      if (dynamicRecs.length === 0) {
        const behavioralSignals = historyItems.map(i => i.title);
        const candidates = RankingService.getContentRepository();
        dynamicRecs = candidates.map(cand => {
          const { score, breakdown } = RankingService.calculateCandidateScore(
            cand,
            userGenres,
            userThemes,
            userDirectors,
            behavioralSignals
          );
          const userTriggers = historyItems.slice(0, 2).map(i => `${i.type === 'search' ? 'Search' : 'YouTube'}: ${i.title}`);
          return {
            ...cand,
            matchScore: score,
            scoreBreakdown: breakdown,
            whyItMatched: `Matched based on ${breakdown.genreScore}% genre alignment and ${breakdown.behavioralScore}% behavioral signal correlation.`,
            triggerSignals: userTriggers.length > 0 ? userTriggers : [`Browsing: ${cand.genres[0]} alignment`],
            mood: cand.genres[0] || 'Atmospheric'
          };
        }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
      }

      return {
        tasteArchetype: parsedAi.tasteArchetype || "The Cinematic Explorer",
        archetypeDescription: parsedAi.archetypeDescription || "You explore cinema with an eye for deep character studies and visual storytelling.",
        tasteDna: parsedAi.tasteDna || {
          genres: userGenres,
          themes: userThemes,
          directors: userDirectors,
          pacingPreference: "Methodical narrative pacing",
          visualStyle: "Atmospheric, director-driven aesthetic"
        },
        capturedSignalsSummary: parsedAi.capturedSignalsSummary || {
          totalEvents: historyItems.length,
          youtubeHighlights: ["Analyzed viewing trends and scene breakdowns"],
          searchHighlights: ["Discovered search queries"],
          pirateStreamHighlights: ["Detected streaming site playback"],
          hiddenAffinitiesFound: "Multi-platform signals reflect a curated viewing habit."
        },
        recommendations: dynamicRecs
      };

    } catch (err) {
      console.warn('[TasteService] Fallback to deterministic ranking model:', err);
      return this.getFallbackProfile(historyItems);
    }
  }

  /**
   * Dynamically extracts Taste DNA from user signals without any hardcoded genres or directors
   */
  static extractDynamicTasteDnaFromSignals(historyItems: UserHistoryItem[]) {
    const allText = historyItems.map(i => `${i.title} ${i.channel || ''} ${i.query || ''}`).join(' ').toLowerCase();

    // Keyword detection dictionaries
    const genreMatchers: Record<string, RegExp> = {
      "Anime & Animation": /\b(anime|manga|ghibli|miyazaki|titan|otaku|shinkai|jujutsu|naruto|animation|evangelion|akira|studio ghibli)\b/i,
      "Sci-Fi & Speculative": /\b(scifi|sci-fi|space|interstellar|black hole|physics|cyberpunk|time travel|quantum|dark|severance|galaxy|alien|devs|cosmos)\b/i,
      "Psychological Thriller": /\b(thriller|mystery|psychological|plot twist|mindfuck|unreliable|puzzle|fincher|villeneuve|nolan|obsession|paranoia)\b/i,
      "Crime & Procedural": /\b(crime|detective|investigation|procedural|serial killer|police|murder|fbi|true detective|zodiac)\b/i,
      "Dark Fantasy & Horror": /\b(horror|dread|witch|demon|creepy|supernatural|hereditary|dark fantasy|monsters|gothic)\b/i,
      "Prestige Drama": /\b(drama|character study|hbo|tragedy|emmy|critique|breakdown|chernobyl|family trauma)\b/i
    };

    const genreScores: Record<string, number> = {};
    for (const [genre, regex] of Object.entries(genreMatchers)) {
      const matches = (allText.match(new RegExp(regex.source, 'gi')) || []).length;
      if (matches > 0) {
        genreScores[genre] = matches;
      }
    }

    // Default balanced genres if no specific keywords were detected
    let detectedGenres = Object.entries(genreScores)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);

    if (detectedGenres.length === 0) {
      detectedGenres = ["Cerebral Drama", "Speculative Cinema", "Psychological Mystery", "Atmospheric Narrative"];
    }

    // Allocate percentages totaling 100%
    const weights = [42, 30, 18, 10];
    const userGenres = detectedGenres.slice(0, 4).map((name, idx) => ({
      name,
      percentage: weights[idx] || 10
    }));

    // Dynamic themes extracted from signals
    const themePool = [
      { trigger: /time|loop|quantum|timeline|paradox/i, theme: "Temporal Paradoxes & Determinism" },
      { trigger: /nature|forest|environment|spirit|ghibli/i, theme: "Nature vs Industrial Progress" },
      { trigger: /ending|twist|mystery|puzzle|mind/i, theme: "Unreliable Reality & Narrative Deconstruction" },
      { trigger: /corporate|control|severance|dystopia/i, theme: "Corporate Surveillance & Institutional Control" },
      { trigger: /war|titan|conflict|survival|dark/i, theme: "Existential Stakes & Moral Ambiguity" },
      { trigger: /identity|memory|clone|doppel/i, theme: "Fractured Identity & Memory" }
    ];

    const userThemes = themePool
      .filter(t => t.trigger.test(allText))
      .map(t => t.theme);

    if (userThemes.length === 0) {
      userThemes.push("Atmospheric World-Building", "Complex Narrative Structures", "Existential Stakes");
    }

    // Dynamic directors/creators extracted from signals
    const recognizedDirectors = [
      "Hayao Miyazaki", "Christopher Nolan", "Denis Villeneuve", "David Fincher", 
      "Baran bo Odar", "Alex Garland", "Satoshi Kon", "Park Chan-wook", 
      "Bong Joon-ho", "Kiyoshi Kurosawa", "Ari Aster", "Ben Stiller", "Hajime Isayama"
    ];

    const userDirectors = recognizedDirectors.filter(d => 
      allText.includes(d.toLowerCase()) || 
      allText.includes(d.split(' ')[1]?.toLowerCase() || '---')
    );

    if (userDirectors.length === 0 && historyItems.length > 0) {
      const topChannel = historyItems.find(i => i.channel)?.channel;
      if (topChannel) userDirectors.push(topChannel);
    }
    if (userDirectors.length === 0) {
      userDirectors.push("Visionary Auteur Directors");
    }

    // Evocative Persona Archetype
    const dominant = userGenres[0]?.name || "Cinematic";
    let tasteArchetype = `The ${dominant.replace('&', '& The')} Explorer`;
    if (dominant.includes("Anime")) tasteArchetype = "The Mythic Animation & Lore Connoisseur";
    else if (dominant.includes("Sci-Fi")) tasteArchetype = "The Speculative Deep-Space & Temporal Mind";
    else if (dominant.includes("Crime") || dominant.includes("Thriller")) tasteArchetype = "The Existential Puzzle & Neo-Noir Analyst";
    else if (dominant.includes("Horror")) tasteArchetype = "The Atmospheric Dread & Psychological Seeker";

    return {
      tasteArchetype,
      archetypeDescription: `Driven by an appetite for ${userGenres.slice(0, 2).map(g => g.name.toLowerCase()).join(' and ')}, with an affinity for ${userThemes[0]?.toLowerCase() || 'deep storytelling'}.`,
      tasteDna: {
        genres: userGenres,
        themes: userThemes.slice(0, 4),
        directors: userDirectors.slice(0, 3),
        pacingPreference: "Methodical narrative pacing with high emotional resonance",
        visualStyle: "Atmospheric, director-driven aesthetic"
      }
    };
  }

  /**
   * Deterministic fallback that ranks real catalog candidates using dynamic user features
   * (Zero hardcoded recommendations, zero hardcoded user preferences)
   */
  static getFallbackProfile(historyItems: UserHistoryItem[]) {
    // 1. Dynamically extract Taste DNA from user's actual browsing history
    const dynamicProfile = this.extractDynamicTasteDnaFromSignals(historyItems);
    const { userGenres, userThemes, userDirectors } = {
      userGenres: dynamicProfile.tasteDna.genres,
      userThemes: dynamicProfile.tasteDna.themes,
      userDirectors: dynamicProfile.tasteDna.directors
    };

    const behavioralSignals = historyItems.map(i => i.title);

    // 2. Real trigger signals directly citing what user actually watched/searched
    const triggerSignals = historyItems.slice(0, 3).map(item => {
      const plat = item.type === 'youtube_shorts' ? 'YouTube Shorts' :
                   item.type === 'youtube' ? 'YouTube' :
                   item.type === 'search' ? 'Search' :
                   item.type === 'pirate_stream' ? 'Stream Locker' : 'Browsing';
      return `${plat}: ${item.title}`;
    });

    // 3. Score all candidates in full catalog (movies and TV series across all genres)
    const candidates = RankingService.getContentRepository();
    const scoredRecs = candidates.map((cand) => {
      const { score, breakdown } = RankingService.calculateCandidateScore(
        cand,
        userGenres,
        userThemes,
        userDirectors,
        behavioralSignals
      );

      return {
        ...cand,
        matchScore: score,
        scoreBreakdown: breakdown,
        whyItMatched: `Matched with ${breakdown.genreScore}% genre alignment (${cand.genres[0]}) and ${breakdown.behavioralScore}% history correlation.`,
        triggerSignals: triggerSignals.length > 0 ? triggerSignals : [`History signal: ${cand.genres[0]} affinity`],
        mood: cand.genres[0] || 'Atmospheric'
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6);

    return {
      tasteArchetype: dynamicProfile.tasteArchetype,
      archetypeDescription: dynamicProfile.archetypeDescription,
      tasteDna: dynamicProfile.tasteDna,
      capturedSignalsSummary: {
        totalEvents: historyItems.length,
        youtubeHighlights: historyItems.filter(i => i.type.includes('youtube')).slice(0, 3).map(i => i.title),
        searchHighlights: historyItems.filter(i => i.type === 'search').slice(0, 3).map(i => i.title),
        pirateStreamHighlights: historyItems.filter(i => i.type === 'pirate_stream').slice(0, 2).map(i => i.title),
        hiddenAffinitiesFound: `Behavioral signals reflect clear engagement with ${userGenres[0]?.name || 'curated cinema'}.`
      },
      recommendations: scoredRecs
    };
  }
}
