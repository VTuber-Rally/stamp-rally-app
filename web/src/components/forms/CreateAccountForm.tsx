import { useAuthActions } from "@convex-dev/auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { RHFCheckbox } from "@/components/inputs/Checkbox.tsx";
import InputField from "@/components/inputs/InputField.tsx";
import { registerWithEmail } from "@/lib/auth.ts";
import { useToast } from "@/lib/hooks/useToast.ts";

type EmailNameFormType = {
  name: string;
  email: string;
  emailConsent: boolean;
};

export const CreateAccountForm = () => {
  const { signIn } = useAuthActions();
  const { t } = useTranslation();
  const { toast } = useToast();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<EmailNameFormType>({
    defaultValues: {
      emailConsent: false,
    },
  });

  const onSubmit: SubmitHandler<EmailNameFormType> = async (data) => {
    try {
      console.log(data);
      await signIn(
        ...registerWithEmail(data.email, {
          name: data.name,
          emailConsent: data.emailConsent,
        }),
      );
    } catch {
      toast({
        title: t("error"),
        description: t("errorCreatingAccount"),
      });
    }
  };

  return (
    <>
      <div className={"flex flex-col items-center"}>
        <h1>{t("saveSubmissionQuestion")}</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={"flex flex-col items-center"}
        >
          <InputField
            type={"text"}
            name={"name"}
            placeholder={t("optionalName")}
            register={register}
            errors={errors["name"]}
            required={false}
          />

          <InputField
            type={"email"}
            name={"email"}
            placeholder={t("email")}
            register={register}
            errors={errors["email"]}
          />

          <div className={"flex items-center"}>
            <Controller
              control={control}
              name="emailConsent"
              render={({ field }) => (
                <RHFCheckbox {...field} id={"emailConsent"} />
              )}
            />
            <label className={"ml-2"} htmlFor={"emailConsent"}>
              {t("consent.email")}
            </label>
          </div>

          <button
            className={
              "mt-2 flex h-10 w-full items-center justify-center rounded-2xl bg-secondary px-2 text-center text-xl font-bold text-black"
            }
            type={"submit"}
          >
            {t("save")}
          </button>
        </form>
      </div>
    </>
  );
};
