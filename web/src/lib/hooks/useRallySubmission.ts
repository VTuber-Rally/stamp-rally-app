import { useQuery } from "convex/react";

import { ConvexId, convexPublicApi } from "@/lib/convex.ts";

export const useRallySubmission = (submissionId: ConvexId<"submissions">) =>
  useQuery(convexPublicApi.submissions.getSubmissionWithStamps, {
    submissionId,
  });
