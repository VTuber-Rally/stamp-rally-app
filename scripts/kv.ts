import { Client, Databases, ID, Query } from "node-appwrite";

import { KV_LIST } from "./kvList.js";
import { getEnv } from "./shared.js";

const env = getEnv();

const client = new Client()
  .setEndpoint(env.APPWRITE_ENDPOINT)
  .setProject(env.APPWRITE_PROJECT_ID)
  .setKey(env.APPWRITE_API_KEY);

const database = new Databases(client);

class KV {
  constructor(private db: Databases) {}

  async listEntries() {
    const docs = await this.db.listDocuments(
      env.DATABASE_ID,
      env.KV_COLLECTION_ID,
    );

    return docs.documents.map((doc) => ({
      key: doc.key as string,
      value: doc.value as string,
    }));
  }

  async getEntry(key: string) {
    const doc = await this.db.listDocuments(
      env.DATABASE_ID,
      env.KV_COLLECTION_ID,
      [Query.equal("key", key)],
    );

    return doc.documents[0];
  }

  async createEntry(key: string, value: string) {
    const existingEntry = await this.getEntry(key);

    if (existingEntry) {
      throw new Error("Entry already exists");
    }

    return this.db.createDocument(
      env.DATABASE_ID,
      env.KV_COLLECTION_ID,
      ID.unique(),
      { key, value },
    );
  }

  async updateEntry(key: string, value: string) {
    const existingEntry = await this.getEntry(key);

    if (!existingEntry) {
      throw new Error("Entry does not exist");
    }

    return this.db.updateDocument(
      env.DATABASE_ID,
      env.KV_COLLECTION_ID,
      existingEntry.$id,
      { key, value },
    );
  }

  async deleteEntry(key: string) {
    const existingEntry = await this.getEntry(key);

    if (!existingEntry) {
      throw new Error("Entry does not exist");
    }

    return this.db.deleteDocument(
      env.DATABASE_ID,
      env.KV_COLLECTION_ID,
      existingEntry.$id,
    );
  }

  async createOrUpdateEntry(key: string, value: string) {
    const existingEntry = await this.getEntry(key);

    if (existingEntry) {
      await this.updateEntry(key, value);
    } else {
      await this.createEntry(key, value);
    }
  }
}

const kv = new KV(database);

switch (process.argv[2]) {
  case "--list": {
    const entries = await kv.listEntries();
    console.table(entries);
    break;
  }
  case "--create":
    if (process.argv[3] && process.argv[4]) {
      await kv.createEntry(process.argv[3], process.argv[4]);
    } else {
      console.error("Usage: pnpm run kv --create <key> <value>");
    }
    break;
  case "--import": {
    const entriesBeforeImport = await kv.listEntries();
    console.log("Before import");
    console.table(entriesBeforeImport);
    for (const keyVal of KV_LIST) {
      await kv.createOrUpdateEntry(keyVal.key, keyVal.value);
    }
    const entriesAfterImport = await kv.listEntries();
    console.log("After import");
    console.table(entriesAfterImport);
    break;
  }
  case "--delete":
    if (process.argv[3]) {
      await kv.deleteEntry(process.argv[3]);
    } else {
      console.error("Usage: pnpm run kv --delete <key>");
    }
    break;
  case "--update":
    if (process.argv[3] && process.argv[4]) {
      await kv.updateEntry(process.argv[3], process.argv[4]);
    } else {
      console.error("Usage: pnpm run kv --update <key> <value>");
    }
    break;

  default:
    console.log("Usage: pnpm run kv --list");
    console.log("Usage: pnpm run kv --create <key> <value>");
    console.log("Usage: pnpm run kv --import");
    console.log("Usage: pnpm run kv --delete <key>");
    console.log("Usage: pnpm run kv --update <key> <value>");
}
