import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ButtonLink } from "@/components/controls/ButtonLink";
import { Checkbox } from "@/components/inputs/Checkbox";
import InputField from "@/components/inputs/InputField";
import { Header } from "@/components/layout/Header";
import { useToast } from "@/lib/hooks/useToast";
import { useUser } from "@/lib/hooks/useUser";

export function ContactPage() {
  const { t } = useTranslation();
  const { user, setName, setEmail } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { secret } = useSearch({
    from: "/_rallyists/_withUserProvider/reward/contest/contact",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      consent: false,
    },
  });

  const isEmailDisabled = !!user?.email;

  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email);
    }
  }, [user?.email, setValue]);

  const onSubmit = async (data: { name: string; email: string }) => {
    if (!secret) {
      toast({
        title: t("contest.contact.error"),
        description: t("contest.missingSecret"),
      });
      return;
    }

    try {
      await setName(data.name);
      if (!isEmailDisabled) {
        await setEmail(data.email);
      }

      navigate({
        to: "/reward/contest/entry",
        search: { secret },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t("contact.error"),
        description: t("contact.error"),
      });
    }
  };

  return (
    <>
      <Header>{t("contest.contact.title")}</Header>

      <p className="mb-4 text-gray-700">{t("contest.contact.description")}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium">
            {t("contest.contact.nameLabel")}
          </label>
          <InputField
            name="name"
            placeholder={t("contest.contact.nameLabel")}
            type="text"
            register={register}
            errors={errors.name}
            required={t("contest.contact.nameRequired")}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium">
            {t("contest.contact.emailLabel")}
          </label>
          <InputField
            name="email"
            placeholder={t("contest.contact.emailLabel")}
            type="email"
            register={register}
            errors={errors.email}
            disabled={isEmailDisabled}
            required={t("contest.contact.emailRequired")}
          />
        </div>

        <div>
          <div className={"flex items-center"}>
            <Checkbox {...register("consent")} id={"consent"} />
            <label className={"ml-2"} htmlFor={"consent"}>
              {t("consentToSaveEmail")}
            </label>
          </div>
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
          {t("cancel")}
        </ButtonLink>
      </form>
    </>
  );
}
