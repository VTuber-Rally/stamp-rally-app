import { UserPreferences } from "shared-lib/src/types/userPreferences";

export const APPWRITE_PREFERENCES_KEYS = {
  EMAIL_CONSENT: "emailConsent",
  LANGUAGE: "language",
} satisfies Readonly<Record<string, keyof UserPreferences>>;
