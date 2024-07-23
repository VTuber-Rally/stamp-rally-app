const {
  VITE_BUILD_ID: buildId,
  VITE_COMMIT_REF: commitRef,
  VITE_PUBLIC_URL: publicUrl,
  VITE_APPWRITE_ENDPOINT: appwriteEndpoint,
  VITE_APPWRITE_PROJECT_ID: appwriteProjectId,
  VITE_DATABASE_ID: databaseId,
  VITE_EVENT_END_DATE: eventEndDate,
  VITE_STANDISTS_COLLECTION_ID: standistsCollectionId,
  VITE_SUBMISSIONS_COLLECTION_ID: submissionsCollectionId,
  VITE_SUBMIT_FUNCTION_ID: submitFunctionId,
  VITE_WHEEL_COLLECTION_ID: wheelCollectionId,
  VITE_GET_PRIVATE_KEY_FUNCTION_ID: getPrivateKeyFunctionId,
} = import.meta.env;

export {
  buildId,
  commitRef,
  publicUrl,
  appwriteEndpoint,
  appwriteProjectId,
  databaseId,
  eventEndDate,
  standistsCollectionId,
  submissionsCollectionId,
  submitFunctionId,
  wheelCollectionId,
  getPrivateKeyFunctionId,
};