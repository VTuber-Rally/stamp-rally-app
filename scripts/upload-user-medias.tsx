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

if (process.argv.length < 3) {
  console.error("Usage: node scripts/upload-user-medias.ts <path-to-folder>");
  process.exit(1);
}

fs.readdirSync(process.argv[2]).forEach(async (file) => {
  const fileContent = fs.readFileSync(path.join(process.argv[2], file));
  const fileType = file.split(".").pop();
  console.log(`Uploading ${file}...`);

  await storage.createFile(
    BUCKET_ID,
    sdk.ID.unique(),
    new File(
      [fileContent],
      file,
      { type: `image/${fileType}` },
    ),
  );
});
