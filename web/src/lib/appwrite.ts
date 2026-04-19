import { Client, Databases, Functions, Storage } from "appwrite";

import { appwriteEndpoint, appwriteProjectId } from "@/lib/consts.ts";

export const client = new Client();

client.setEndpoint(appwriteEndpoint).setProject(appwriteProjectId);

export { ID, Query } from "appwrite";

export const databases = new Databases(client);
export const functions = new Functions(client);
export const storage = new Storage(client);
