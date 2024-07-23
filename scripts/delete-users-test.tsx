import * as sdk from "node-appwrite";
import { getEnv } from "./shared.js";

const {
  APPWRITE_PROJECT_ID,
  APPWRITE_ENDPOINT,
  PROFILE_DATABASE_ID,
  PROFILE_COLLECTION_ID,
  APPWRITE_API_KEY,
} = getEnv();

const client = new sdk.Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const users = new sdk.Users(client);
const database = new sdk.Databases(client);

const usersExisting = await users.list([sdk.Query.contains("labels", "test")]);

console.log(
  `Found ${usersExisting.total} user${usersExisting.total > 1 ? "s" : ""}`,
);

const promises = usersExisting.users.map((user) => {
  return database
    .listDocuments(PROFILE_DATABASE_ID, PROFILE_COLLECTION_ID, [
      sdk.Query.equal("userId", user.$id),
    ])
    .then((documents) => {
      const documentDeletionPromises = documents.documents.map((document) => {
        return database.deleteDocument(
          PROFILE_DATABASE_ID,
          PROFILE_COLLECTION_ID,
          document.$id,
        );
      });
      return Promise.all(documentDeletionPromises);
    })
    .then(() => users.delete(user.$id));
});

await Promise.all(promises);

console.log(
  `Deleted ${usersExisting.total} user${usersExisting.total > 1 ? "s" : ""}`,
);
