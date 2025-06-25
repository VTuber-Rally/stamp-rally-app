/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface ImportMetaEnv {
  VITE_APPWRITE_ENDPOINT: string;
  VITE_APPWRITE_PROJECT_ID: string;
  readonly VITE_APPWRITE_NOTIFICATION_PROVIDER_ID: string;
  VITE_PUBLIC_URL: string;
  VITE_COMMIT_REF: string;
  VITE_BUILD_ID: string;
  VITE_DATABASE_ID: string;
  VITE_STANDISTS_COLLECTION_ID: string;
  VITE_SUBMIT_FUNCTION_ID: string;
  VITE_SUBMISSIONS_COLLECTION_ID: string;
  VITE_WHEEL_COLLECTION_ID: string;
  VITE_CONTEST_PARTICIPANTS_COLLECTION_ID: string;
  VITE_REGISTER_CONTEST_PARTICIPANT_FUNCTION_ID: string;
  VITE_GET_PRIVATE_KEY_FUNCTION_ID: string;
  VITE_SEND_NOTIFICATION_FUNCTION_ID: string;
  VITE_KV_COLLECTION_ID: string;
  VITE_ASSETS_BUCKET_ID: string;
  readonly VITE_MAP_TILES_URL: string;

  readonly VITE_STANDARD_REWARD_MIN_STAMPS_REQUIREMENT: string;
  readonly VITE_PREMIUM_REWARD_MIN_STAMPS_REQUIREMENT: string;
  VITE_EVENT_END_DATE: string;

  readonly VITE_INDEXEDDB_NAME: string;

  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_VAPID_PUBLIC_KEY: string;
  readonly VITE_RALLY_FINISHERS_EN_TOPIC_ID: string;
  readonly VITE_RALLY_FINISHERS_FR_TOPIC_ID: string;

  readonly VITE_SENTRY_DSN: string;
  readonly VITE_SENTRY_ENVIRONMENT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  plausible: {
    (
      eventName: string,
      arguments?: {
        callback?: () => unknown;
        props?: Record<string, string>;
      },
    ): void;
    q?: unknown[];
  };
}

declare const BUILD_TIMESTAMP: string;
