const {
  VITE_BUILD_ID: buildId,
  VITE_COMMIT_REF: commitRef,
  VITE_STANDARD_REWARD_MIN_STAMPS_REQUIREMENT,
  VITE_PREMIUM_REWARD_MIN_STAMPS_REQUIREMENT,
  VITE_IS_MINOR_HALL_REQUIRED: isMinorHallRequired,
  VITE_FIREBASE_API_KEY: firebaseApiKey,
  VITE_FIREBASE_AUTH_DOMAIN: firebaseAuthDomain,
  VITE_FIREBASE_PROJECT_ID: firebaseProjectId,
  VITE_FIREBASE_STORAGE_BUCKET: firebaseStorageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: firebaseMessagingSenderId,
  VITE_FIREBASE_APP_ID: firebaseAppId,
  VITE_FIREBASE_VAPID_PUBLIC_KEY: firebaseVapidPublicKey,
  VITE_SENTRY_DSN: sentryDSN,
  VITE_SENTRY_ENVIRONMENT: sentryEnvironment,
  VITE_INDEXEDDB_NAME: indexedDbName,
  VITE_MAP_TILES_URL: mapTilesURL,
  VITE_CONVEX_URL: convexURL,
  VITE_CONVEX_SITE_URL: convexSiteURL,
  VITE_SITE_URL: siteUrl,
  DEV: isDev,
  PROD: isProd,
} = import.meta.env;

const standardRewardMinStampsRequirement = parseInt(
  VITE_STANDARD_REWARD_MIN_STAMPS_REQUIREMENT,
);
const premiumRewardMinStampsRequirement = parseInt(
  VITE_PREMIUM_REWARD_MIN_STAMPS_REQUIREMENT,
);

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
};

const mapCenter = [2.5191618272698406, 48.96983303992434] as [number, number];
const jwkAlgorithm = { name: "ECDSA", namedCurve: "P-384" } as const;
const signAlgorithm = {
  name: "ECDSA",
  hash: { name: "SHA-384" },
} as const;

export {
  buildId,
  commitRef,
  convexURL,
  convexSiteURL,
  siteUrl,
  standardRewardMinStampsRequirement,
  premiumRewardMinStampsRequirement,
  isMinorHallRequired,
  isDev,
  isProd,
  jwkAlgorithm,
  signAlgorithm,
  firebaseConfig,
  firebaseVapidPublicKey,
  indexedDbName,
  mapCenter,
  mapTilesURL,
  sentryDSN,
  sentryEnvironment,
};
