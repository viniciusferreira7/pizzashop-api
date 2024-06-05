import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DB_URL ?? '' //FIXME: should use env from env schema instead of process.env, but happen an error 
  }
});