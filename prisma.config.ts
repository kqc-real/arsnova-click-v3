import { defineConfig } from 'prisma/config';

const databaseUrl =
  process.env['DATABASE_URL'] ??
  'postgresql://arsnova_user:secretpassword@localhost:5432/arsnova_v3_dev?schema=public';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
  migrate: {
    path: 'prisma/migrations',
    async url() {
      return databaseUrl;
    },
  },
  // Früher in prisma/prisma.config.ts
  earlyAccess: true,
});
