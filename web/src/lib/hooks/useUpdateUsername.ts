import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useToast } from "@/lib/hooks/useToast";
import { useUser } from "@/lib/hooks/useUser";

export function useUpdateUsername() {
  const { user, setName } = useUser();
  const { t } = useTranslation();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (username: string) => {
      if (!user) {
        throw new Error("User not found");
      }

      await setName(username);
    },
    onSuccess: () => {
      toast({
        title: t("settings.usernameUpdated"),
      });
    },
    onError: () => {
      toast({
        title: t("settings.usernameUpdateFailed"),
      });
    },
  });

  return { updateUsername: mutate, isPending };
}
