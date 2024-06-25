/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface ImportMetaEnv {
  VITE_APPWRITE_PROJECT_ID: string;
  VITE_PUBLIC_URL: string;
  VITE_COMMIT_REF: string;
  VITE_BUILD_ID: string;
  VITE_DATABASE_ID: string;
  VITE_STANDISTS_COLLECTION_ID: string;
  VITE_SUBMIT_FUNCTION_ID: string;
  VITE_SUBMISSIONS_COLLECTION_ID: string;
  VITE_WHEEL_COLLECTION_ID: string;

  VITE_EVENT_END_DATE: string;
}

declare const BUILD_TIMESTAMP: string;
