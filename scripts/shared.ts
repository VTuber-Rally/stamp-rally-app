import "dotenv/config";
import { z } from "zod";
import * as sdk from "node-appwrite";

const envSchema = z.object({
  APPWRITE_API_KEY: z.string(),
  APPWRITE_PROJECT_ID: z.string(),
  APPWRITE_ENDPOINT: z.string(),
  DATABASE_ID: z.string(),
  STANDISTS_COLLECTION_ID: z.string(),
  KV_COLLECTION_ID: z.string(),
  CONTEST_PARTICIPANTS_COLLECTION_ID: z.string(),
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
    CONTEST_PARTICIPANTS_COLLECTION_ID,
    BUCKET_ID,
  } = process.env;

  return envSchema.parse({
    APPWRITE_API_KEY,
    APPWRITE_PROJECT_ID,
    APPWRITE_ENDPOINT,
    DATABASE_ID,
    STANDISTS_COLLECTION_ID,
    KV_COLLECTION_ID,
    CONTEST_PARTICIPANTS_COLLECTION_ID,
    BUCKET_ID,
  });
};

export const isProduction = process.env.NODE_ENV === "production";

export const debugPrint = (...args: string[]) => {
  if (!isProduction) {
    console.log(...args);
  }
};

export const env = getEnv();

export const appwriteClient = new sdk.Client()
  .setEndpoint(env.APPWRITE_ENDPOINT)
  .setProject(env.APPWRITE_PROJECT_ID)
  .setKey(env.APPWRITE_API_KEY);
