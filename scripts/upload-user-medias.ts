import * as sdk from "node-appwrite";
import { getEnv } from "./shared.js";
import * as path from "path";
import * as fs from "fs";
const {
  APPWRITE_PROJECT_ID,
  APPWRITE_ENDPOINT,
  PROFILE_DATABASE_ID,
  PROFILE_COLLECTION_ID,
  APPWRITE_API_KEY,
  BUCKET_ID,
} = getEnv();

const client = new sdk.Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const storage = new sdk.Storage(client);

export const deleteUserMedia = async (fileId: string) => {
  if (fileId === "fallback") {
    return;
  }
  console.log(`Deleting ${fileId}...`);
  try {
    await storage.deleteFile(BUCKET_ID, fileId);
  } catch (error) {
    console.error(`Error deleting ${fileId}: ${error}`);
  }
};

export const uploadUserMedia = async (filePath: string): Promise<string> => {
  const fileContent = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const fileType = fileName.split(".").pop();
  console.log(`Uploading ${fileName}...`);

  const file = await storage.createFile(
    BUCKET_ID,
    sdk.ID.unique(),
    new File([fileContent], fileName, { type: `image/${fileType}` })
  );

  return file.$id;
};
