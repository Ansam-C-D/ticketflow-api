import 'dotenv/config';
import { defineConfig } from 'prisma/config';

seed: 'tsx prisma/seed.ts';
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations'
  },
  engine: 'classic',
  datasource: {
    url: process.env.DATABASE_URL
  }
});
