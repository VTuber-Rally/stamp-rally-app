import { skipToken, useQuery } from "@tanstack/react-query";
import { SubmissionWithId } from "@vtuber-stamp-rally/shared-lib/models/Submission.ts";

import { QUERY_KEYS } from "@/lib/QueryKeys.ts";
import { db } from "@/lib/db.ts";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions.ts";

export const getContestEligibility = (
  submissions: SubmissionWithId[],
  numbersOfContestParticipations: number,
): { eligible: true } | { eligible: false; reason: string } => {
  const numbersOfValidatedSubmissions = submissions.filter(
    (x) => x.redeemed,
  ).length;

  const hasEnoughSubmissions =
    numbersOfValidatedSubmissions > numbersOfContestParticipations;

  if (!hasEnoughSubmissions) {
    return { eligible: false, reason: "not_submitted" };
  }

  return { eligible: true };
};

export const useIsEligibleForContest = () => {
  const { data: submissions } = useRallySubmissions();

  const { data, isPending } = useQuery({
    queryKey: [QUERY_KEYS.CONTEST_ELIGIBILITY],
    queryFn: submissions
      ? async () => {
          const numberOfContestParticipations =
            await db.contestParticipations.count();
          return getContestEligibility(
            submissions,
            numberOfContestParticipations,
          );
        }
      : skipToken,
  });

  return { eligibilityData: data, isPending };
};
