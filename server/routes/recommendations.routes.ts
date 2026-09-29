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

    // 1. Retrieve candidates & compute mathematical ranking scores
    const candidates = RankingService.getFilmRepository();
    const scoredCandidates = candidates.map(cand => {
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

    // 2. Generate custom LLM contextual framing
    const prompt = `You are "Plotted", the cinema recommendation engine.
The user is asking: "${customPrompt || mood}".
Their top-ranked films are: ${scoredCandidates.slice(0, 3).map(c => `${c.title} (${c.year})`).join(', ')}.

Provide a 1-sentence personalized trailer pitch for each film explaining why it answers their exact request right now.
Return JSON:
{
  "curationVibe": "Short title describing this batch",
  "pitches": {
    "${scoredCandidates[0]?.title}": "pitch 1",
    "${scoredCandidates[1]?.title}": "pitch 2",
    "${scoredCandidates[2]?.title}": "pitch 3"
  }
}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6
        }
      });
      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        for (const item of scoredCandidates) {
          if (parsed.pitches?.[item.title]) {
            item.whyItMatched = parsed.pitches[item.title];
          }
        }
      }
    } catch (err) {
      console.warn('[recommendations.routes] LLM pitch generation fallback:', err);
    }

    res.json({
      curationVibe: `Tuned for "${customPrompt || mood}"`,
      recommendations: scoredCandidates
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
