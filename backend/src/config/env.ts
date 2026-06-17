import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().url(),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
})

export const env = envSchema.parse(process.env)
