import { Router, Request, Response } from 'express';
import { rateLimiter } from '../middleware/rateLimiter';
import { validateBody, RecommendLiveSchema } from '../middleware/validate';
import { RankingService } from '../services/ranking.service';
import { ai } from '../ai/gemini.client';

const router = Router();

/**
 * POST /api/recommend-live
 * Live contextual movie curation with ranking formula + LLM pitch
 */
router.post('/', rateLimiter, validateBody(RecommendLiveSchema), async (req: Request, res: Response) => {
  try {
    const { mood = 'all', customPrompt = '', tasteProfile } = req.body;

    const userGenres = tasteProfile?.tasteDna?.genres || [
      { name: "Psychological Thriller", percentage: 38 },
      { name: "Sci-Fi / Neo-Noir", percentage: 28 },
      { name: "Cerebral Mystery", percentage: 20 },
      { name: "Dark Drama", percentage: 14 }
    ];
    const userThemes = tasteProfile?.tasteDna?.themes || ["Unreliable Narrators", "Existential Stakes"];
    const userDirectors = tasteProfile?.tasteDna?.directors || ["Denis Villeneuve", "Christopher Nolan"];
    const behavioralSignals = [customPrompt, mood].filter(Boolean);

    // Generate personalized recommendations via Gemini based on query & taste
    const prompt = `You are "Plotted", an elite cinema recommendation engine.
The user is requesting movie recommendations for mood/query: "${customPrompt || mood}".
User's taste DNA genres: ${userGenres.map((g: any) => `${g.name} (${g.percentage}%)`).join(', ')}.
User's favorite themes: ${userThemes.join(', ')}.
User's favorite directors: ${userDirectors.join(', ')}.

CRITICAL REQUIREMENT: Dynamically generate 4 to 5 REAL movies that specifically satisfy their request ("${customPrompt || mood}").
Do NOT limit yourself to any fixed list. If they ask for 80s action, recommend 80s action. If they ask for romance, anime, comedy, or indie puzzles, recommend films specifically matching that.

Return a valid JSON object matching:
{
  "curationVibe": "Catchy title describing this specific curation (e.g. 'Mind-Bending Multiverse Enigmas')",
  "recommendations": [
    {
      "id": "rec-live-1",
      "title": "Exact Real Movie Title",
      "year": 2018,
      "director": "Director Name",
      "matchScore": 95,
      "genres": ["Genre1", "Genre2"],
      "overview": "2-sentence synopsis.",
      "whyItMatched": "Personalized pitch explaining why this answers their query '${customPrompt || mood}'.",
      "triggerSignals": ["Request: ${customPrompt || mood}"],
      "mood": "${mood || 'Atmospheric'}",
      "rating": "8.0/10 IMDb",
      "runtime": "118 min",
      "whereToWatch": ["Prime Video", "Apple TV"],
      "isUndergroundGem": false
    }
  ]
}`;

    let recommendations: any[] = [];
    let curationVibe = `Tuned for "${customPrompt || mood}"`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      });
      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        curationVibe = parsed.curationVibe || curationVibe;
        if (Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
          recommendations = parsed.recommendations.map((r: any, idx: number) => ({
            id: r.id || `rec-live-${Date.now()}-${idx}`,
            title: r.title,
            year: typeof r.year === 'number' ? r.year : 2021,
            director: r.director || "Acclaimed Director",
            genres: Array.isArray(r.genres) ? r.genres : ["Drama"],
            overview: r.overview || "A film perfectly matched to your criteria.",
            matchScore: typeof r.matchScore === 'number' ? Math.min(99, Math.max(75, r.matchScore)) : 92,
            whyItMatched: r.whyItMatched || `Selected for your interest in ${customPrompt || mood}.`,
            triggerSignals: Array.isArray(r.triggerSignals) ? r.triggerSignals : [`Request: ${customPrompt || mood}`],
            mood: r.mood || mood || 'Atmospheric',
            rating: r.rating || '7.8/10 IMDb',
            runtime: r.runtime || '115 min',
            whereToWatch: Array.isArray(r.whereToWatch) ? r.whereToWatch : ["Prime Video", "Apple TV"],
            isUndergroundGem: Boolean(r.isUndergroundGem)
          }));
        }
      }
    } catch (err) {
      console.warn('[recommendations.routes] LLM generation fallback:', err);
    }

    // Fallback if AI generation failed
    if (recommendations.length === 0) {
      const candidates = RankingService.getFilmRepository();
      recommendations = candidates.map(cand => {
        const { score, breakdown } = RankingService.calculateCandidateScore(
          cand,
          userGenres,
          userThemes,
          userDirectors,
          behavioralSignals,
          customPrompt || mood
        );
        return {
          ...cand,
          matchScore: score,
          scoreBreakdown: breakdown,
          whyItMatched: `Ranked ${score}% with ${breakdown.genreScore}% genre alignment for your ${customPrompt || mood} search.`,
          triggerSignals: [`Mood: ${customPrompt || mood}`, `Genre fit: ${cand.genres[0]}`],
          mood: cand.genres[0] || 'Atmospheric'
        };
      }).sort((a, b) => b.matchScore - a.matchScore);
    }

    res.json({
      curationVibe,
      recommendations
    });
  } catch (error) {
    console.error('[recommendations.routes] Error generating recommendations:', error);
    res.status(500).json({
      error: 'Recommendation Failed',
      message: 'Failed to generate live recommendations. Please try again.'
    });
  }
});

export default router;
