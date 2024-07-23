import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/QueryKeys.ts";
import { databases, Query } from "@/lib/appwrite.ts";
import { databaseId, wheelCollectionId } from "@/lib/consts.ts";

export const useWheelEntries = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.WHEEL_ENTRIES],
    queryFn: async () => {
      const docs = await databases.listDocuments(
        databaseId,
        wheelCollectionId,
        [Query.equal("disabled", false)],
      );

      // sort using the order field
      docs.documents.sort((a, b) => {
        console.log(a.order, b.order);
        return a.order - b.order;
      });

      console.log(docs.documents.map((doc) => doc.name));

      return docs.documents.map((doc) => ({
        option: doc.name,
        probability: doc.probability,
      }));
    },
  });
};
