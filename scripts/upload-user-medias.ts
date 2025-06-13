import * as fs from "fs";
import * as sdk from "node-appwrite";
import * as path from "path";

import { debugPrint, getEnv } from "./shared.js";

const { APPWRITE_PROJECT_ID, APPWRITE_ENDPOINT, APPWRITE_API_KEY, BUCKET_ID } =
  getEnv();

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

export const uploadUserMedia = async (filePath: string) => {
  const fileContent = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const fileType = fileName.split(".").pop();
  debugPrint(`Uploading ${fileName}...`);

  const file = await storage.createFile(
    BUCKET_ID,
    sdk.ID.unique(),
    new File([fileContent], fileName, { type: `image/${fileType}` }),
  );

  return file.$id;
};
