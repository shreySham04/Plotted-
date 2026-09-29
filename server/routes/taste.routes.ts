import { Router, Request, Response } from 'express';
import { rateLimiter } from '../middleware/rateLimiter';
import { validateBody, AnalyzeTasteSchema } from '../middleware/validate';
import { TasteService } from '../services/taste.service';

const router = Router();

/**
 * POST /api/analyze-taste
 * Synthesizes user's taste vector from normalized browsing events
 */
router.post('/', rateLimiter, validateBody(AnalyzeTasteSchema), async (req: Request, res: Response) => {
  try {
    const { historyItems = [] } = req.body;
    const profile = await TasteService.synthesizeTasteProfile(historyItems);
    res.json(profile);
  } catch (error) {
    console.error('[taste.routes] Failed to analyze taste profile:', error);
    res.status(500).json({
      error: 'Taste Analysis Failed',
      message: 'Unable to analyze taste profile right now. Please retry in a few moments.'
    });
  }
});

export default router;
