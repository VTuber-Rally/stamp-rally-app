import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import type { ContestParticipant } from "@vtube-stamp-rally/shared-lib/models/ContestParticipant.ts";

import { QUERY_KEYS } from "@/lib/QueryKeys";
import { Query, client, databases } from "@/lib/appwrite";
import { contestParticipantsCollectionId, databaseId } from "@/lib/consts";

async function fetchContestParticipants() {
  const response = await databases.listDocuments<ContestParticipant>(
    databaseId,
    contestParticipantsCollectionId,
    [Query.isNull("drawnDate"), Query.orderAsc("registeredAt")],
  );
  return response.documents;
}

export function useContestParticipants() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${databaseId}.collections.${contestParticipantsCollectionId}.documents`,
      (response) => {
        // we subscribe to the events of creation (normal), update (surprising) and deletion (who knows, it can happen!)
        // so we invalidate to force the refresh of the participants list
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create",
          ) ||
          response.events.includes(
            "databases.*.collections.*.documents.*.update",
          ) ||
          response.events.includes(
            "databases.*.collections.*.documents.*.delete",
          )
        ) {
          // Invalidate the query to force a reload
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.CONTEST_PARTICIPANTS],
          });
        }
      },
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return useQuery({
    queryKey: [QUERY_KEYS.CONTEST_PARTICIPANTS],
    queryFn: () => fetchContestParticipants(),
    refetchInterval: 30000,
  });
}
