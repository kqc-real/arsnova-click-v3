import { publicProcedure, router } from '../trpc';
import { HealthCheckResponseSchema } from '@arsnova/shared-types';

/**
 * Health-Check Router.
 * Liefert den API-Status – nützlich zum Testen der Verbindung.
 */
export const healthRouter = router({
  check: publicProcedure.output(HealthCheckResponseSchema).query(() => {
    return {
      status: 'ok' as const,
      timestamp: new Date().toISOString(),
      version: '0.1.0',
    };
  }),
});
