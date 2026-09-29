import { startServer } from './server/index';

startServer().catch((err) => {
  console.error('[Plotted] Fatal server error:', err);
  process.exit(1);
});
