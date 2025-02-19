import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Checkbox } from "@/components/inputs/Checkbox.tsx";
import InputField from "@/components/inputs/InputField.tsx";
import { useToast } from "@/lib/hooks/useToast.ts";
import { useUser } from "@/lib/hooks/useUser.ts";

type EmailNameFormType = {
  name: string;
  email: string;
  consent: boolean;
};

export const CreateAccountForm = () => {
  const { t } = useTranslation();
  const { user, setName, setEmail, setPref, loginAnonymous } = useUser();
  const { toast } = useToast();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<EmailNameFormType>();

  const onSubmit = async (data: EmailNameFormType) => {
    if (!user) {
      // create anonymous user
      await loginAnonymous();
    }
    try {
      if (data.email) {
        await setEmail(data.email);
        if (data.consent) {
          await setPref("consent", true);
        }
      }

      console.log(data);
      if (data.name) {
        await setName(data.name);
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
          {!user?.name && (
            <InputField
              type={"text"}
              name={"name"}
              placeholder={t("optionalName")}
              register={register}
              errors={errors["name"]}
              required={false}
            />
          )}

          {!user?.email && (
            <>
              <InputField
                type={"email"}
                name={"email"}
                placeholder={t("email")}
                register={register}
                errors={errors["name"]}
              />

              <div className={"flex items-center"}>
                <Checkbox {...register("consent")} id={"consent"} />
                <label className={"ml-2"} htmlFor={"consent"}>
                  {t("consentToSaveEmail")}
                </label>
              </div>
            </>
          )}

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
