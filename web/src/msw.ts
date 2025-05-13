import { HttpResponse, http } from "msw";

import { type Standist } from "@vtube-stamp-rally/shared-lib/models/Standist.ts";

import avatar from "@/stubs/avatar.png";

import { StandistsFromAppwrite } from "./stubs/Standists.ts";

export const handlers = [
  http.get(
    "https://cloud.appwrite.io/v1/databases/DB_ID/collections/STANDISTS_COLLECTION_ID/documents",
    ({ request }) => {
      const url = new URL(request.url);

      if (url.searchParams.has("queries[0]")) {
        const query = url.searchParams.get("queries[0]");
        if (query != null) {
          const parsedQuery = JSON.parse(query) as {
            attribute: keyof Standist;
            values: string[];
          };
          return HttpResponse.json({
            ...StandistsFromAppwrite,
            documents: StandistsFromAppwrite.documents.filter((standist) => {
              return standist[parsedQuery.attribute] === parsedQuery.values[0];
            }),
          });
        }
      }

      return HttpResponse.json(StandistsFromAppwrite);
    },
  ),
  http.get(
    "https://cloud.appwrite.io/v1/storage/buckets/rally2025-assets/files/*/download",
    async () => {
      const arrayBuffer = await fetch(avatar).then((res) => res.arrayBuffer());
      return HttpResponse.arrayBuffer(arrayBuffer, {
        headers: {
          "Content-Type": "image/png",
        },
      });
    },
  ),
];
