/** Ce script crée une nouvelle entrée dans la base de données toutes les 10 secondes.
 * Il est utilisé pour tester l'ajout à InfluxDB par le webhook.
 * */

import * as sdk from "node-appwrite";
import { getEnv } from "./shared.js";

const {
  APPWRITE_PROJECT_ID,
  APPWRITE_ENDPOINT,
  PROFILE_DATABASE_ID,
  PROFILE_COLLECTION_ID,
  APPWRITE_API_KEY,
} = getEnv();

const isProduction = process.env.NODE_ENV === "production";

const client = new sdk.Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const users = new sdk.Users(client);
const database = new sdk.Databases(client);

while (true) {
  // use nodejs's sleep function

  await database.createDocument(
    PROFILE_DATABASE_ID,
    PROFILE_COLLECTION_ID,
    sdk.ID.unique(),
    {
      val: new Date().toISOString(),
      artist: "test" + (Math.random() > 0.5 ? "a" : "b"),
    },
  );

  console.log("Created a new document");

  await new Promise((resolve) => setTimeout(resolve, 10000));
}
