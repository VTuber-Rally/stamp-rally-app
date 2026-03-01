import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Checkbox } from "@/components/inputs/Checkbox.tsx";
import InputField from "@/components/inputs/InputField.tsx";
import { signUpWithEmail, useCurrentUser } from "@/lib/betterauth";
import { useToast } from "@/lib/hooks/useToast.ts";

type EmailNameFormType = {
  name: string;
  email: string;
  emailConsent: boolean;
};

export const CreateAccountForm = () => {
  const user = useCurrentUser();
  const { t } = useTranslation();
  const { toast } = useToast();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<EmailNameFormType>();

  const onSubmit: SubmitHandler<EmailNameFormType> = async (data) => {
    try {
      const { data: response, error } = await signUpWithEmail(
        data.email,
        data.name,
      );
      if (error) {
        // TODO: customize by error (email already used, etc.)
        toast({
          title: t("error"),
          description: t("errorCreatingAccount"),
        });
      }
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
            errors={errors["name"]}
          />

          <div className={"flex items-center"}>
            <Checkbox {...register("emailConsent")} id={"emailConsent"} />
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
