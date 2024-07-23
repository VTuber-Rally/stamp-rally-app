import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../QueryKeys.ts";
import { databases } from "@/lib/appwrite.ts";
import { Standist } from "@/lib/models/Standist.ts";
import { databaseId, submissionsCollectionId } from "@/lib/consts.ts";

type Submission = {
  $id: string;
  redeemed: boolean;
  submitted: string; // date

  stamps: {
    $id: string;
    generated: string; // date
    scanned: string; // date
    standist: Standist;
    signature: string;
  }[];
};

export const useRallySubmission = (documentId: string) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [QUERY_KEYS.SUBMISSION, documentId],
    queryFn: async () =>
      (await databases.getDocument(
        databaseId,
        submissionsCollectionId,
        documentId,
      )) as unknown as Submission,
    networkMode: "online",
  });

  return { isLoading, error, data };
};
