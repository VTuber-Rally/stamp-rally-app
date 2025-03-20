import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  APPWRITE_API_KEY: z.string(),
  APPWRITE_PROJECT_ID: z.string(),
  APPWRITE_ENDPOINT: z.string(),
  DATABASE_ID: z.string(),
  STANDISTS_COLLECTION_ID: z.string(),
  KV_COLLECTION_ID: z.string(),
  BUCKET_ID: z.string(),
});

export const getEnv = () => {
  const {
    APPWRITE_API_KEY,
    APPWRITE_PROJECT_ID,
    APPWRITE_ENDPOINT,
    DATABASE_ID,
    STANDISTS_COLLECTION_ID,
    KV_COLLECTION_ID,
    BUCKET_ID,
  } = process.env;

  const env = envSchema.parse({
    APPWRITE_API_KEY,
    APPWRITE_PROJECT_ID,
    APPWRITE_ENDPOINT,
    DATABASE_ID,
    STANDISTS_COLLECTION_ID,
    KV_COLLECTION_ID,
    BUCKET_ID,
  });

  return env;
};
