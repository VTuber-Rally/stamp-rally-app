import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useToast } from "@/lib/hooks/useToast";
import { useUser } from "@/lib/hooks/useUser";

export const Route = createFileRoute(
  "/_rallyists/_withUserProviderNoAutoAnonymous/reward/contest/contact",
)({
  component: ContactPage,
  validateSearch: (search) => {
    return z
      .object({
        secret: z.string(),
      })
      .parse(search);
  },
});

function ContactPage() {
  const { t } = useTranslation();
  const { user, setName, setEmail } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { secret } = Route.useSearch();

  const methods = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    if (!secret) {
      toast({
        title: t("contact.error"),
        description: t("contact.missingSecret"),
      });
      return;
    }

    try {
      await setName(data.name);
      await setEmail(data.email);
    } catch (error) {
      console.error(error);
      toast({
        title: t("contact.error"),
        description: t("contact.errorUpdatingProfile"),
      });
    } finally {
      navigate({
        to: "/reward/contest/entry",
        search: { secret },
      });
    }
  });
}
