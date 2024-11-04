import { useTranslation } from "react-i18next";
import { useUser } from "@/lib/hooks/useUser.ts";
import { useForm } from "react-hook-form";
import InputField from "@/components/InputField.tsx";
import { Checkbox } from "@/components/Checkbox.tsx";
import { useToast } from "@/lib/hooks/useToast.ts";

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
              "text-center bg-secondary text-black px-2 w-full flex justify-center items-center rounded-2xl font-bold h-10 text-xl mt-2"
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
