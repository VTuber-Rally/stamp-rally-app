import "dotenv/config";

export const getEnv = () => {
  const {
    APPWRITE_API_KEY,
    APPWRITE_PROJECT_ID,
    APPWRITE_ENDPOINT,
    PROFILE_DATABASE_ID,
    PROFILE_COLLECTION_ID,
    BUCKET_ID,
    CONTEST_PARTICIPANTS_COLLECTION_ID,
  } = process.env;

  if (!APPWRITE_ENDPOINT) {
    throw new Error("APPWRITE_ENDPOINT is not set");
  }

  if (!APPWRITE_API_KEY) {
    throw new Error("APPWRITE_API_KEY is not set");
  }

  if (!APPWRITE_PROJECT_ID) {
    throw new Error("APPWRITE_PROJECT_ID is not set");
  }

  if (!PROFILE_DATABASE_ID || !PROFILE_COLLECTION_ID) {
    throw new Error("PROFILE_DATABASE_ID or PROFILE_COLLECTION_ID is not set");
  }

  if (!BUCKET_ID) {
    throw new Error("BUCKET_ID is not set");
  }

  if (!CONTEST_PARTICIPANTS_COLLECTION_ID) {
    throw new Error("CONTEST_PARTICIPANTS_COLLECTION_ID is not set");
  }

  return {
    APPWRITE_API_KEY,
    APPWRITE_PROJECT_ID,
    APPWRITE_ENDPOINT,
    PROFILE_DATABASE_ID,
    PROFILE_COLLECTION_ID,
    BUCKET_ID,
    CONTEST_PARTICIPANTS_COLLECTION_ID,
  };
};
