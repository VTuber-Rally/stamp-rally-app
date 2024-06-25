import { useNavigate } from "@tanstack/react-router";
import { useUser } from "@/lib/userContext.tsx";
import { SubmitHandler, useForm } from "react-hook-form";
import InputField from "@/components/InputField.tsx";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLogin } from "@/lib/hooks/useLogin.ts";
import Loader from "@/components/Loader.tsx";

type SigninForm = {
  email: string;
  password: string;
};

type SigninPageProps = {
  navigateTo: string;
};

function SignInPage({ navigateTo }: SigninPageProps) {
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
  }, [user, navigate]);

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
    <div className={"flex flex-col flex-grow justify-center"}>
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
              "p-2 bg-tertiary text-black rounded-xl flex items-center justify-center"
            }
          >
            <div className={"flex items-center"}>
              <Loader size={2} className={"mr-2"} />
              {t("loading")}
            </div>
          </button>
        ) : (
          <button
            className="p-2 bg-tertiary text-black rounded-xl"
            type="submit"
          >
            {t("login")}
          </button>
        )}
      </form>
    </div>
  );
}

export default SignInPage;
