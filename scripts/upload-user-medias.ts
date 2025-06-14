import * as fs from "fs";
import * as sdk from "node-appwrite";
import * as path from "path";

import { appwriteClient, debugPrint, env } from "./shared.js";

const { BUCKET_ID } = env;

const storage = new sdk.Storage(appwriteClient);

export const deleteUserMedia = async (fileId: string) => {
  if (fileId === "fallback") {
    return;
  }
  debugPrint(`Deleting ${fileId}...`);
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
