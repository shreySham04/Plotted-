import { Router, Request, Response } from 'express';
import { ExtensionService } from '../services/extension.service';

const router = Router();

/**
 * GET /api/extension/files
 * Returns raw source code for Chrome extension
 */
router.get('/files', (_req: Request, res: Response) => {
  try {
    const files = ExtensionService.getFiles();
    res.json(files);
  } catch (error) {
    console.error('[extension.routes] Failed to read extension files:', error);
    res.status(500).json({ error: 'Failed to read extension sources' });
  }
});

/**
 * GET /api/extension/download-zip
 * Packages the actual extension/ directory into a downloadable ZIP archive
 */
router.get('/download-zip', async (_req: Request, res: Response) => {
  try {
    const zipBuffer = await ExtensionService.generateZipBuffer();
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="plotted-extension.zip"');
    res.send(zipBuffer);
  } catch (error) {
    console.error('[extension.routes] Failed to package extension zip:', error);
    res.status(500).send('Failed to package extension bundle');
  }
});

export default router;
