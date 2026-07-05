import { ConvexId, convexPublicApi, useDLEQuery } from "@/lib/convex.ts";

export const useRallySubmission = (submissionId: ConvexId<"submissions">) =>
  useDLEQuery({
    query: convexPublicApi.submissions.getSubmissionWithStamps,
    args: {
      submissionId,
    },
  });
