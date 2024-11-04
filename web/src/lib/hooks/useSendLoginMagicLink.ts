import { useMutation } from "@tanstack/react-query";
import { useUser } from "@/lib/hooks/useUser.ts";
import { useToast } from "@/lib/hooks/useToast.ts";
import { useTranslation } from "react-i18next";

export const useSendLoginMagicLink = () => {
  const { createMagicLink } = useUser();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (data: { email: string }) =>
      await createMagicLink(data.email),
    onSuccess: async () => {
      toast({
        title: t("loginMagicLinkToast.title"),
        description: t("loginMagicLinkToast.description"),
      });
    },
    networkMode: "online",
  });
};
