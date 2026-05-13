import { useFollowParticipation } from "@/lib/hooks/contest/useFollowParticipation.ts";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions";

export const getContestEligibility = (
  redeemedSubmissionsCount: number,
  existingParticipationsCount: number,
): { eligible: true } | { eligible: false; reason: string } => {
  const hasEnoughSubmissions =
    redeemedSubmissionsCount > existingParticipationsCount;

  if (!hasEnoughSubmissions) {
    return { eligible: false, reason: "not_submitted" };
  }

  return { eligible: true };
};

export const useIsEligibleForContest = () => {
  const submissions = useRallySubmissions();
  const { currentParticipation } = useFollowParticipation();

  // While either is loading, return pending
  if (submissions === undefined || currentParticipation === undefined) {
    return { eligibilityData: undefined, isPending: true };
  }

  const validSubmissionsCount = submissions.length;
  // If user has no current (undrawn) participation, count is 0; otherwise 1
  const existingParticipationsCount = currentParticipation !== null ? 1 : 0;

  const eligibilityData = getContestEligibility(
    validSubmissionsCount,
    existingParticipationsCount,
  );

  return { eligibilityData, isPending: false };
};
