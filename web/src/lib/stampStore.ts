import { create } from "zustand";
import { persist } from "zustand/middleware";

import { ConvexId } from "@/lib/convex.ts";

export interface Stamp {
  boothId: ConvexId<"booths">;
  expiryTimestamp: number;
  scanTimestamp: number;
  signature: string;
  submitted: boolean;
}

interface StampStore {
  stamps: Stamp[];
  upsertStamp: (stamp: Stamp) => void;
  submitAllStamps: () => void;
}

export const useStampStore = create<StampStore>()(
  persist(
    (set) => ({
      stamps: [],
      submitAllStamps: () => {
        set((state) => ({
          stamps: state.stamps.map((stamp) => {
            if (stamp.submitted) return stamp;
            return {
              ...stamp,
              submitted: true,
            };
          }),
        }));
      },
      upsertStamp: (stamp) => {
        set((state) => {
          const alreadyExistingStampIndex = state.stamps.findIndex(
            (searchedStamp) =>
              searchedStamp.boothId === stamp.boothId &&
              !searchedStamp.submitted,
          );
          if (alreadyExistingStampIndex !== -1) {
            return {
              stamps: [
                ...state.stamps.slice(0, alreadyExistingStampIndex),
                stamp,
                ...state.stamps.slice(alreadyExistingStampIndex + 1),
              ],
            };
          }
          return { stamps: [...state.stamps, stamp] };
        });
      },
    }),
    {
      name: "stamps",
      version: 1,
    },
  ),
);

window.addEventListener("storage", (event) => {
  if (event.key === useStampStore.persist.getOptions().name) {
    void useStampStore.persist.rehydrate();
  }
});
