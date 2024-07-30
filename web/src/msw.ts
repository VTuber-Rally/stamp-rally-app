import { http, HttpResponse } from "msw";
import { StandistsFromAppwrite } from "./stubs/Standists.ts";

export const handlers = [
  http.get(
    "https://cloud.appwrite.io/v1/databases/DB_ID/collections/STANDISTS_COLLECTION_ID/documents",
    () => HttpResponse.json(StandistsFromAppwrite),
  ),
];
