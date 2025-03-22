import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { ButtonLink } from "@/components/controls/ButtonLink";
import InputField from "@/components/inputs/InputField";
import { Header } from "@/components/layout/Header";
import { useToast } from "@/lib/hooks/useToast";
import { useUser } from "@/lib/hooks/useUser";

export const Route = createFileRoute(
  "/_rallyists/_withUserProvider/reward/contest/contact",
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email);
    }
  }, [navigate, secret, user?.email]);

  const onSubmit = async (data: { name: string; email: string }) => {
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

      // Redirection vers la page d'inscription
      navigate({
        to: "/reward/contest/entry",
        search: { secret },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t("contact.error"),
        description: t("contact.errorUpdatingProfile"),
      });
    }
  };

  return (
    <>
      <Header>{t("contest.contact.title")}</Header>

      <p className="mb-4 text-gray-700">{t("contest.contact.description")}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputField
          name="name"
          placeholder={t("contest.contact.nameLabel")}
          type="text"
          register={register}
          errors={errors.name}
        />

        <InputField
          name="email"
          placeholder={t("contest.contact.emailLabel")}
          type="email"
          register={register}
          errors={errors.email}
        />

        <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
          {t("contest.contact.privacyNotice")}
        </div>

        <ButtonLink
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              {t("contest.contact.submitting")}
            </span>
          ) : (
            t("contest.contact.submit")
          )}
        </ButtonLink>

        <ButtonLink
          href="/reward"
          type="link"
          size="small"
          className="bg-gray-200"
          bg={null}
        >
          {t("contest.entry.cancel")}
        </ButtonLink>
      </form>
    </>
  );
}
