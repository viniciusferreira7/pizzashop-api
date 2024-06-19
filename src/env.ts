import { z } from 'zod'

const envSchema = z.object({
  EMAIL_DEV: z.string().email().optional(),
  RESEND_API_KEY: z.string().min(1),
  DB_URL: z.string().url().min(1),
  API_BASE_URL: z.string().url().min(1),
  AUTH_REDIRECT_URL: z.string().url().min(1),
  JWT_SECRET_KEY: z.string(),
})

export const env = envSchema.parse(process.env)
