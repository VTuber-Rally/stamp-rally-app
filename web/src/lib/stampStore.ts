import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Stamp {
  boothId: string;
  expiryTimestamp: number;
  scanTimestamp: number;
  signature: string;
  submitted: boolean;
}

interface StampStore {
  stamps: Stamp[];
  upsertStamp: (stamp: Stamp) => void;
}

export const useStampStore = create<StampStore>()(
  persist(
    (set) => ({
      stamps: [],
      upsertStamp: (stamp) =>
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
        }),
    }),
    {
      name: "stamps",
    },
  ),
);
