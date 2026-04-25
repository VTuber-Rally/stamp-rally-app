import { useMemo } from "react";

import { Stamp, useStampStore } from "@/lib/stampStore.ts";

const onlyNonSubmittedStamps = (stamp: Stamp) => !stamp.submitted;

export const getCollectedStamps = () =>
  useStampStore.getState().stamps.filter(onlyNonSubmittedStamps);

export const useCollectedStamps = () => {
  const stampStore = useStampStore();
  const collectedStamps = useMemo(
    () => stampStore.stamps.filter(onlyNonSubmittedStamps),
    [stampStore.stamps],
  );
  return collectedStamps;
};
