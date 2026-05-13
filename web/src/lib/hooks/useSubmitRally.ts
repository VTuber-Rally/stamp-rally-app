import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation } from "convex/react";
import { useMemo } from "react";

import { getAnonymousAccount } from "@/lib/auth.ts";
import { convexPublicApi, useDLEMutation } from "@/lib/convex.ts";
import { useStampStore } from "@/lib/stampStore.ts";

export const useSubmitRally = () => {
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const { mutate, error, isLoading } = useDLEMutation(
    useMutation(convexPublicApi.submissions.submitRally),
  );
  const stampStore = useStampStore();
  const submittableStamps = useMemo(
    () =>
      stampStore.stamps
        .filter((stamp) => !stamp.submitted)
        .map((stamp) => ({
          scanTimestamp: stamp.scanTimestamp,
          expiryTimestamp: stamp.expiryTimestamp,
          boothId: stamp.boothId,
          signature: Uint8Array.fromBase64(stamp.signature, {
            alphabet: "base64url",
          }).buffer,
        })),
    [stampStore.stamps],
  );

  const submitRally = async () => {
    if (!isAuthenticated) {
      await signIn(...getAnonymousAccount());
    }

    return mutate({ stamps: submittableStamps }).then((data) => {
      if (data.status === "error") {
        return Promise.reject(new Error(data.message));
      } else {
        stampStore.submitAllStamps();
        // TODO: store submissions in Zustand?
      }
    });
  };

  return { submitRally, error, isLoading };
};
