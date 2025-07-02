import { captureException } from "@sentry/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { SubmitRallyFunctionResponse } from "@vtube-stamp-rally/shared-lib/functions/submitRally.ts";

import { QUERY_KEYS } from "@/lib/QueryKeys.ts";
import { submitFunctionId } from "@/lib/consts.ts";
import { db } from "@/lib/db.ts";

import { functions } from "../appwrite.ts";
import { useCollectedStamps } from "./useCollectedStamps.ts";

const useRallySubmit = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const { data: stamps } = useCollectedStamps();
  const queryClient = useQueryClient();

  const { error, isPending, data, isError, isSuccess, mutate } = useMutation({
    mutationFn: () =>
      functions.createExecution(
        submitFunctionId,
        JSON.stringify({
          stamps: stamps ?? [],
        }),
      ),
    networkMode: "online",
    onSuccess: (data) => {
      if (data.responseStatusCode !== 200) {
        throw new Error(data.responseBody);
      }

      const submissionInfo = JSON.parse(
        data.responseBody,
      ) as SubmitRallyFunctionResponse;

      if (submissionInfo.status === "error") {
        throw new Error(submissionInfo.message);
      }

      db.submissions
        .add({
          submissionId: submissionInfo.submissionId,
          stamps: stamps ?? [],
          redeemed: false,
          submitted: new Date(),
        })
        .then(
          () => {
            // mark the stamps as submitted
            stamps?.forEach((stamp) => {
              db.stamps.update(stamp.id, { submitted: true }).catch((error) => {
                captureException(error);
              });
            });
          },
          (error) => {
            captureException(error);
          },
        );

      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.SUBMISSIONS,
          QUERY_KEYS.STAMPS,
          QUERY_KEYS.CONTEST_ELIGIBILITY,
        ],
      });

      window.plausible("Rally Submitted", {
        props: {
          stampCount: (stamps?.length ?? 0).toString(),
        },
      });

      onSuccess?.();
    },
  });

  return { isSuccess, isError, data, isPending, error, mutate };
};

export { useRallySubmit };
