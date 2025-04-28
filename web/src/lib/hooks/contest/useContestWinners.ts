import { useQuery } from "@tanstack/react-query";
import { Query } from "appwrite";
import type { ContestParticipant } from "shared-lib";

import { QUERY_KEYS } from "@/lib/QueryKeys";
import { databases } from "@/lib/appwrite";
import { contestParticipantsCollectionId, databaseId } from "@/lib/consts";

async function fetchContestWinners() {
  const response = await databases.listDocuments<ContestParticipant>(
    databaseId,
    contestParticipantsCollectionId,
    [Query.equal("isWinner", true), Query.orderDesc("drawnDate")],
  );
  return response.documents;
}

export function useContestWinners() {
  return useQuery({
    queryKey: [QUERY_KEYS.CONTEST_WINNERS],
    queryFn: fetchContestWinners,
  });
}
