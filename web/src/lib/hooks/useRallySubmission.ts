import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../QueryKeys.ts";
import { databases } from "@/lib/appwrite.ts";
import { Standist } from "@/lib/models/Standist.ts";

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
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_SUBMISSIONS_COLLECTION_ID,
        documentId,
      )) as unknown as Submission,
    networkMode: "online",
  });

  return { isLoading, error, data };
};
