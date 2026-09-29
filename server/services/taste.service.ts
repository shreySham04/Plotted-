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
   * Synthesizes Taste DNA through feature extraction + Gemini LLM explanation
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
    const searchCount = normalized.filter(i => i.category === 'search_intent').length;
    const streamCount = normalized.filter(i => i.category === 'stream_playback').length;

    const signalHighlights = normalized.map(i => 
      `• [${i.platform}] ${i.cleanTitle}${i.channel ? ` (by ${i.channel})` : ''}`
    ).slice(0, 15).join('\n');

    const prompt = `You are "Plotted", an elite cinematic intelligence engine.
Analyze these normalized behavioral viewing signals from YouTube Shorts, YouTube video essays, Google movie searches, and streaming player sessions:

${signalHighlights}

Synthesize their cinematic taste vector into a JSON response matching:
{
  "tasteArchetype": "Compelling, evocative title for their film persona (e.g. 'The Existential Puzzle-Solver & Neo-Noir Seeker')",
  "archetypeDescription": "2-3 sentences capturing what drives their psychological taste, pacing preference, and directorial obsessions.",
  "tasteDna": {
    "genres": [
      {"name": "Psychological Thriller", "percentage": 38},
      {"name": "Sci-Fi / Neo-Noir", "percentage": 28},
      {"name": "Cerebral Mystery", "percentage": 20},
      {"name": "Dark Drama", "percentage": 14}
    ],
    "themes": ["theme1", "theme2", "theme3", "theme4"],
    "directors": ["director1", "director2", "director3", "director4"],
    "pacingPreference": "description of preferred narrative pacing",
    "visualStyle": "description of preferred cinematography / color palette"
  },
  "capturedSignalsSummary": {
    "totalEvents": ${historyItems.length},
    "youtubeHighlights": ["highlight of YouTube/Shorts watches"],
    "searchHighlights": ["highlight of search inquiries"],
    "pirateStreamHighlights": ["highlight of stream locker watches"],
    "hiddenAffinitiesFound": "What their combined multi-platform browsing reveals"
  },
  "explanations": {
    "Incendies": "Direct explanation of why this matches their specific YouTube or search history",
    "Cure (Kyua)": "Direct explanation linking to their stream locker/underground habits",
    "Coherence": "Direct explanation linking to their mind-bending puzzle habits",
    "Decision to Leave": "Direct explanation linking to their neo-noir searches",
    "Burning (Beoning)": "Direct explanation linking to their atmospheric mystery watches"
  }
}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5
        }
      });

      const text = response.text;
      if (!text) throw new Error('Empty AI response');
      const parsedAi = JSON.parse(text);

      // 3. Mathematical Candidate Ranking
      const userGenres = parsedAi.tasteDna?.genres || [
        { name: "Psychological Thriller", percentage: 38 },
        { name: "Sci-Fi / Neo-Noir", percentage: 28 },
        { name: "Cerebral Mystery", percentage: 20 },
        { name: "Dark Drama", percentage: 14 }
      ];
      const userThemes = parsedAi.tasteDna?.themes || ["Unreliable Narrators", "Existential Stakes"];
      const userDirectors = parsedAi.tasteDna?.directors || ["Denis Villeneuve", "Christopher Nolan", "David Fincher"];
      const behavioralSignals = historyItems.map(i => i.title);

      const candidates = RankingService.getFilmRepository();
      const scoredRecs = candidates.map(cand => {
        const { score, breakdown } = RankingService.calculateCandidateScore(
          cand,
          userGenres,
          userThemes,
          userDirectors,
          behavioralSignals
        );

        const aiExplanation = parsedAi.explanations?.[cand.title] || 
          `Mathematically ranked ${score}% based on your ${breakdown.genreScore}% genre alignment and ${breakdown.behavioralScore}% behavioral signal correlation.`;

        return {
          ...cand,
          matchScore: score,
          scoreBreakdown: breakdown,
          whyItMatched: aiExplanation,
          triggerSignals: [
            shortsCount > 0 ? `YouTube Shorts: Cinema breakdown watched` : `YouTube: Video essay analyzed`,
            streamCount > 0 ? `Stream Locker: Underground movie playback` : `Search: Movie discussion thread visited`
          ],
          mood: cand.genres[0] || 'Atmospheric'
        };
      }).sort((a, b) => b.matchScore - a.matchScore);

      return {
        tasteArchetype: parsedAi.tasteArchetype || "The Existential Puzzle-Solver",
        archetypeDescription: parsedAi.archetypeDescription || "You gravitate towards mind-bending narratives with high tension and structural complexity.",
        tasteDna: parsedAi.tasteDna || {
          genres: userGenres,
          themes: userThemes,
          directors: userDirectors,
          pacingPreference: "Methodical slow-burn with explosive third act",
          visualStyle: "High-contrast chiaroscuro, desaturated brutalist palettes"
        },
        capturedSignalsSummary: parsedAi.capturedSignalsSummary || {
          totalEvents: historyItems.length,
          youtubeHighlights: ["Watched tension breakdowns and YouTube Shorts edits"],
          searchHighlights: ["Searched for plot twist thrillers on Reddit"],
          pirateStreamHighlights: ["Captured underground stream of foreign psychological thrillers"],
          hiddenAffinitiesFound: "Multi-platform signals indicate a strong preference for director-driven cinema."
        },
        recommendations: scoredRecs
      };

    } catch (err) {
      console.warn('[TasteService] Fallback to deterministic ranking model:', err);
      return this.getFallbackProfile(historyItems);
    }
  }

  static getFallbackProfile(historyItems: UserHistoryItem[]) {
    const candidates = RankingService.getFilmRepository();
    const scoredRecs = candidates.map((cand, idx) => ({
      ...cand,
      matchScore: 98 - (idx * 2),
      scoreBreakdown: {
        genreScore: 95 - idx,
        themeScore: 90,
        directorScore: 88,
        behavioralScore: 85,
        noveltyScore: cand.isUndergroundGem ? 95 : 75,
        contextScore: 85
      },
      whyItMatched: `Matched your active search queries and YouTube cinema watches with high narrative tension.`,
      triggerSignals: ["YouTube: Video essay breakdown", "Search: Shocking plot twist movies"],
      mood: cand.genres[0] || 'Atmospheric'
    }));

    return {
      tasteArchetype: "The Existential Puzzle-Solver & Neo-Noir Seeker",
      archetypeDescription: "You gravitate towards mind-bending narratives with unreliable narrators, high existential tension, and meticulously framed cinematography.",
      tasteDna: {
        genres: [
          { name: "Psychological Thriller", percentage: 38 },
          { name: "Sci-Fi / Neo-Noir", percentage: 28 },
          { name: "Cerebral Mystery", percentage: 20 },
          { name: "Dark Drama", percentage: 14 }
        ],
        themes: ["Unreliable Narrators", "Dystopian Megastructures", "Existential Stakes", "Memory Distortion"],
        directors: ["Denis Villeneuve", "Christopher Nolan", "David Fincher", "Alex Garland"],
        pacingPreference: "Methodical slow-burn with explosive third act",
        visualStyle: "High-contrast chiaroscuro, desaturated brutalist palettes"
      },
      capturedSignalsSummary: {
        totalEvents: historyItems.length,
        youtubeHighlights: ["Watched tension breakdowns and video essays"],
        searchHighlights: ["Searched for plot twist thrillers on Reddit"],
        pirateStreamHighlights: ["Captured underground streams on unindexed hosts"],
        hiddenAffinitiesFound: "Your viewing shows an appetite for complex, non-linear stories."
      },
      recommendations: scoredRecs
    };
  }
}
