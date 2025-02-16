import { useMutation } from "@tanstack/react-query";

import { StandistsEditProfileForm } from "@/components/routes/standists/StandistsProfilePage.tsx";
import { useDatabase } from "@/lib/hooks/useDatabase.ts";

export const useUpdateStandistProfile = () => {
  const { findAndUpdateProfile } = useDatabase();

  return useMutation({
    mutationFn: async (data: StandistsEditProfileForm & { userId: string }) => {
      const { userId, ...profileData } = data;
      return findAndUpdateProfile(userId, profileData);
    },
  });
};
