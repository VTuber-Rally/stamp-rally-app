import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import Loader from "@/components/Loader.tsx";
import InputField from "@/components/inputs/InputField.tsx";
import { useLogin } from "@/lib/hooks/useLogin.ts";
import { useUser } from "@/lib/hooks/useUser.ts";

type SigninForm = {
  email: string;
  password: string;
};

type SigninPageProps = {
  navigateTo: string;
};

function SignInForm({ navigateTo }: SigninPageProps) {
  const { user } = useUser();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useLogin(navigateTo);

  useEffect(() => {
    const redirect = async () => {
      if (user) {
        await navigate({ to: navigateTo });
      }
    };
    redirect();
  }, [user, navigate, navigateTo]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<SigninForm>();
  const onSubmitRegister: SubmitHandler<SigninForm> = async (data) => {
    try {
      clearErrors();
      mutate(data);
    } catch (error) {
      console.log(error);
      setError("email", {
        type: "manual",
        message: "Invalid email or password",
      });
    }
  };

  useEffect(() => {
    if (isError) {
      setError("password", {
        type: "manual",
        message: `${error.message}`,
      });
    }
  }, [isError, error, setError]);

  return (
    <div className={"flex grow flex-col justify-center"}>
      <h1 className={"mb-4 text-3xl"}>{t("login")}</h1>
      <form
        className={"flex flex-col"}
        onSubmit={handleSubmit(onSubmitRegister)}
      >
        <InputField
          type={"email"}
          name={"email"}
          placeholder={t("email")}
          register={register}
          errors={errors["email"]}
        />

        <InputField
          type={"password"}
          name={"password"}
          placeholder={t("password")}
          register={register}
          errors={errors["password"]}
        />

        {isPending ? (
          <button
            disabled={true}
            className={
              "flex items-center justify-center rounded-xl bg-tertiary p-2 text-black"
            }
          >
            <div className={"flex items-center"}>
              <Loader size={2} className={"mr-2"} />
              {t("loading")}
            </div>
          </button>
        ) : (
          <button
            className="rounded-xl bg-tertiary p-2 text-black"
            type="submit"
          >
            {t("login")}
          </button>
        )}
      </form>
    </div>
  );
}

export default SignInForm;
