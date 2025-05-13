export interface UserPreferences {
  privateKey?: string; // stringified JWK, only for artist accounts
  language?: string;
  emailConsent?: boolean;
}
