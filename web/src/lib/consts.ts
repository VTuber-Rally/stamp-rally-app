const {
  VITE_BUILD_ID: buildId,
  VITE_COMMIT_REF: commitRef,
  VITE_PUBLIC_URL: publicUrl,
  VITE_APPWRITE_ENDPOINT: appwriteEndpoint,
  VITE_APPWRITE_PROJECT_ID: appwriteProjectId,
  VITE_APPWRITE_NOTIFICATION_PROVIDER_ID: appwriteNotificationProviderId,
  VITE_DATABASE_ID: databaseId,
  VITE_STANDISTS_COLLECTION_ID: standistsCollectionId,
  VITE_SUBMISSIONS_COLLECTION_ID: submissionsCollectionId,
  VITE_SUBMIT_FUNCTION_ID: submitFunctionId,
  VITE_WHEEL_COLLECTION_ID: wheelCollectionId,
  VITE_GET_PRIVATE_KEY_FUNCTION_ID: getPrivateKeyFunctionId,
  VITE_KV_COLLECTION_ID: keyValueCollectionId,
  VITE_ASSETS_BUCKET_ID: assetsBucketId,
  VITE_STAMPS_TO_COLLECT,
  VITE_CONTEST_PARTICIPANTS_COLLECTION_ID: contestParticipantsCollectionId,
  VITE_REGISTER_CONTEST_PARTICIPANT_FUNCTION_ID:
    registerContestParticipantFunctionId,
  VITE_FIREBASE_API_KEY: firebaseApiKey,
  VITE_FIREBASE_AUTH_DOMAIN: firebaseAuthDomain,
  VITE_FIREBASE_PROJECT_ID: firebaseProjectId,
  VITE_FIREBASE_STORAGE_BUCKET: firebaseStorageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: firebaseMessagingSenderId,
  VITE_FIREBASE_APP_ID: firebaseAppId,
  VITE_FIREBASE_VAPID_PUBLIC_KEY: firebaseVapidPublicKey,
  DEV: isDev,
  PROD: isProd,
} = import.meta.env;

const stampsToCollect = parseInt(VITE_STAMPS_TO_COLLECT);

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
};

const mapCenter = [2.518988, 48.970091] as [number, number];

export {
  buildId,
  commitRef,
  publicUrl,
  appwriteEndpoint,
  appwriteProjectId,
  appwriteNotificationProviderId,
  databaseId,
  standistsCollectionId,
  submissionsCollectionId,
  submitFunctionId,
  wheelCollectionId,
  keyValueCollectionId,
  getPrivateKeyFunctionId,
  assetsBucketId,
  stampsToCollect,
  isDev,
  isProd,
  contestParticipantsCollectionId,
  registerContestParticipantFunctionId,
  firebaseConfig,
  firebaseVapidPublicKey,
  mapCenter,
};
