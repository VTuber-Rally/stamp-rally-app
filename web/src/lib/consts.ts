const {
  VITE_BUILD_ID: buildId,
  VITE_COMMIT_REF: commitRef,
  VITE_PUBLIC_URL: publicUrl,
  VITE_APPWRITE_ENDPOINT: appwriteEndpoint,
  VITE_APPWRITE_PROJECT_ID: appwriteProjectId,
  VITE_DATABASE_ID: databaseId,
  VITE_STANDISTS_COLLECTION_ID: standistsCollectionId,
  VITE_SUBMISSIONS_COLLECTION_ID: submissionsCollectionId,
  VITE_SUBMIT_FUNCTION_ID: submitFunctionId,
  VITE_WHEEL_COLLECTION_ID: wheelCollectionId,
  VITE_GET_PRIVATE_KEY_FUNCTION_ID: getPrivateKeyFunctionId,
  VITE_KV_COLLECTION_ID: keyValueCollectionId,
  VITE_ASSETS_BUCKET_ID: assetsBucketId,
  VITE_STAMPS_TO_COLLECT,
} = import.meta.env;

const stampsToCollect = parseInt(VITE_STAMPS_TO_COLLECT);

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

export {
  buildId,
  commitRef,
  publicUrl,
  appwriteEndpoint,
  appwriteProjectId,
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
};
