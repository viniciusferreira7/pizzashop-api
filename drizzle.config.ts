import { defineConfig } from "drizzle-kit";
import { env } from './src/env';
import en from 'zod/locales/en.js';

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: env.DB_URL
  }
});