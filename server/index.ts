import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

import eventsRouter from './routes/events.routes';
import tasteRouter from './routes/taste.routes';
import recommendationsRouter from './routes/recommendations.routes';
import detectionRouter from './routes/detection.routes';
import extensionRouter from './routes/extension.routes';

dotenv.config();

export async function createApp() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // Register API routers
  app.use('/api/events', eventsRouter);
  app.use('/api/analyze-taste', tasteRouter);
  app.use('/api/recommend-live', recommendationsRouter);
  app.use('/api/detect-stream', detectionRouter);
  app.use('/api/extension', extensionRouter);

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'plotted-api', timestamp: new Date().toISOString() });
  });

  return app;
}

export async function startServer() {
  const app = await createApp();
  const isProd = process.env.NODE_ENV === 'production';
  const port = Number(process.env.PORT) || 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Plotted] Modular server running at http://0.0.0.0:${port}`);
  });
}
