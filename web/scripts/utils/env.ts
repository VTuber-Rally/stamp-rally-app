import { cwd } from "node:process";
import { loadEnv } from "vite";

const scriptEnvironmentVariablesKeys = [
  "VITE_CONVEX_URL",
  "CONVEX_ADMIN_KEY",
  "ARTISTS_SPREADSHEET_ID",
  "IMAGES_FOLDER_ID",
] as const;

type ScriptEnvKeys = (typeof scriptEnvironmentVariablesKeys)[number];

type ScriptEnv = {
  [Key in ScriptEnvKeys]: string;
};

// This will load environment variables from
// - process environment variables
// - .env.script
// - .env.local
// - .env
const env = loadEnv("script", cwd(), "");

export const scriptEnv = scriptEnvironmentVariablesKeys.reduce((acc, key) => {
  return { ...acc, [key]: env[key] };
}, {}) as ScriptEnv;

console.debug("Loaded environment variables from", cwd(), scriptEnv);
