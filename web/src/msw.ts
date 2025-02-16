import { HttpResponse, http } from "msw";

import { Standist } from "@/lib/models/Standist.ts";

import { StandistsFromAppwrite } from "./stubs/Standists.ts";

export const handlers = [
  http.get(
    "https://cloud.appwrite.io/v1/databases/DB_ID/collections/STANDISTS_COLLECTION_ID/documents",
    ({ request }) => {
      const url = new URL(request.url);

      if (url.searchParams.has("queries[0]")) {
        const query = url.searchParams.get("queries[0]");
        if (query != null) {
          const parsedQuery = JSON.parse(query);
          return HttpResponse.json({
            ...StandistsFromAppwrite,
            documents: StandistsFromAppwrite.documents.filter((standist) => {
              return (
                standist[parsedQuery.attribute as keyof Standist] ===
                parsedQuery.values[0]
              );
            }),
          });
        }
      }

      return HttpResponse.json(StandistsFromAppwrite);
    },
  ),
];
