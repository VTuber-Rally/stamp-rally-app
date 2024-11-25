import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../QueryKeys.ts";
import { useDatabase } from "@/lib/hooks/useDatabase.ts";

export const useRallySubmission = (documentId: string) => {
  const { getSubmission } = useDatabase();

  const { isLoading, error, data } = useQuery({
    queryKey: [QUERY_KEYS.SUBMISSION, documentId],
    queryFn: () => getSubmission(documentId),
    networkMode: "online",
  });

  return { isLoading, error, data };
};
