import { useMutation } from "@tanstack/react-query";
import { useUser } from "@/lib/hooks/useUser.ts";
import { useToast } from "@/lib/hooks/useToast.ts";
import { useTranslation } from "react-i18next";

export const useLogout = () => {
  const { logout } = useUser();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async () => await logout(),
    onSuccess: async () => {
      toast({
        title: t("logoutToast.title"),
        description: t("logoutToast.description"),
      });
    },
    networkMode: "online",
  });
};
