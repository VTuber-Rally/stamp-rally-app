import * as sdk from "node-appwrite";

import { StandistDocument } from "@vtube-stamp-rally/shared-lib/models/Standist.ts";

import { appwriteClient, env } from "./shared.js";
import { deleteMedia } from "./upload-media.ts";

const { DATABASE_ID, STANDISTS_COLLECTION_ID } = env;

const users = new sdk.Users(appwriteClient);
const database = new sdk.Databases(appwriteClient);

const usersExisting = await users.list([sdk.Query.contains("labels", "test")]);

console.log(
  `Found ${usersExisting.total} user${usersExisting.total > 1 ? "s" : ""}`,
);

const promises = usersExisting.users.map((user) => {
  return database
    .listDocuments<StandistDocument>(DATABASE_ID, STANDISTS_COLLECTION_ID, [
      sdk.Query.equal("userId", user.$id),
    ])
    .then((documents) => {
      const documentDeletionPromises = documents.documents.map((document) => {
        return Promise.all([
          database.deleteDocument(
            DATABASE_ID,
            STANDISTS_COLLECTION_ID,
            document.$id,
          ),
          deleteMedia(document.image),
        ]);
      });
      return Promise.all(documentDeletionPromises);
    })
    .then(() => users.delete(user.$id));
});

await Promise.all(promises);

console.log(
  `Deleted ${usersExisting.total} user${usersExisting.total > 1 ? "s" : ""}`,
);
