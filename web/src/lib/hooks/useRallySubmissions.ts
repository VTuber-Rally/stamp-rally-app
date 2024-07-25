import { skipToken, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../QueryKeys.ts";
import { db } from "@/lib/db.ts";
import { databases, Query } from "@/lib/appwrite.ts";
import { databaseId, submissionsCollectionId } from "@/lib/consts.ts";
import { useUser } from "@/lib/hooks/useUser.ts";

export const useRallySubmissions = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { isLoading, error, data } = useQuery({
    queryKey: [QUERY_KEYS.SUBMISSIONS],
    refetchInterval: 1000 * 30, // toutes les 30 secondes
    refetchIntervalInBackground: true,
    queryFn: user
      ? async () => {
          const dbSubmissions = await db.submissions.toArray();

          const { documents } = await databases.listDocuments(
            databaseId,
            submissionsCollectionId,
            [Query.equal("userId", user.$id)],
          );

          for (const submission of documents) {
            const dbSubmission = dbSubmissions.find(
              (sub) => sub.submissionId === submission.$id,
            );

            if (!dbSubmission) {
              // if it's not in local db, we add it
              await db.submissions.add({
                submissionId: submission.$id,
                stamps: submission.stamps,
                submitted: new Date(submission.submitted),
                redeemed: submission.redeemed,
              });
              continue;
            }

            if (dbSubmission.redeemed === submission.redeemed) {
              continue;
            }

            await queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.SUBMISSION, submission.id],
            });

            db.submissions.update(dbSubmission, {
              redeemed: submission.redeemed,
            });
          }

          return dbSubmissions;
        }
      : skipToken,
    networkMode: "always",
  });

  return { isLoading, error, data };
};
