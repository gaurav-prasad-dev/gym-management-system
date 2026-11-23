import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load from current working directory or backend root
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const envSchema = z.object({
  PORT: z.string().default('5001').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  CORS_ORIGIN: z.string().default('http://localhost:5174'),
  JWT_ACCESS_SECRET: z.string().default('gym_management_super_secret_access_key_2026_xyz'),
  JWT_REFRESH_SECRET: z.string().default('gym_management_super_secret_refresh_key_2026_xyz'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
