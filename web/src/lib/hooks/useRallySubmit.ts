import { useMutation, useQueryClient } from "@tanstack/react-query";
import { functions } from "../appwrite.ts";
import { useCollectedStamps } from "./useCollectedStamps.ts";
import { db } from "@/lib/db.ts";
import { QUERY_KEYS } from "@/lib/QueryKeys.ts";
import { submitFunctionId } from "@/lib/consts.ts";

const useRallySubmit = () => {
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
      console.log(data);
      if (data.responseStatusCode !== 200) {
        throw new Error(data.responseBody);
      }

      const submissionInfo = JSON.parse(data.responseBody);

      db.submissions.add({
        submissionId: submissionInfo.submissionId,
        stamps: stamps ?? [],
        redeemed: false,
        submitted: new Date(),
      });

      // mark the stamps as submitted
      stamps?.forEach((stamp) => {
        db.stamps.update(stamp.id, { submitted: true });
      });

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUBMISSIONS] });
    },
  });

  return { isSuccess, isError, data, isPending, error, mutate };
};

export { useRallySubmit };
