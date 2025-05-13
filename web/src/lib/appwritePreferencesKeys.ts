import { UserPreferences } from "@vtuber-stamp-rally/shared-lib/types/userPreferences.ts";

export const APPWRITE_PREFERENCES_KEYS = {
  EMAIL_CONSENT: "emailConsent",
  LANGUAGE: "language",
} satisfies Readonly<Record<string, keyof UserPreferences>>;
