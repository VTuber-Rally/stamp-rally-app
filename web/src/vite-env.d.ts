/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface ImportMetaEnv {
  VITE_APPWRITE_ENDPOINT: string;
  VITE_APPWRITE_PROJECT_ID: string;
  VITE_PUBLIC_URL: string;
  VITE_COMMIT_REF: string;
  VITE_BUILD_ID: string;
  VITE_DATABASE_ID: string;
  VITE_STANDISTS_COLLECTION_ID: string;
  VITE_SUBMIT_FUNCTION_ID: string;
  VITE_SUBMISSIONS_COLLECTION_ID: string;
  VITE_WHEEL_COLLECTION_ID: string;
  VITE_CONTEST_PARTICIPANTS_COLLECTION_ID: string;
  VITE_GET_PRIVATE_KEY_FUNCTION_ID: string;
  VITE_ASSETS_BUCKET_ID: string;

  VITE_STAMPS_TO_COLLECT: string;
  VITE_EVENT_END_DATE: string;
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
