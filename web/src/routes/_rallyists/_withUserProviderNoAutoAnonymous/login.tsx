import { createFileRoute } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";

import { ButtonLink } from "@/components/ButtonLink.tsx";
import { Header } from "@/components/Header.tsx";
import InputField from "@/components/InputField.tsx";
import Loader from "@/components/Loader.tsx";
import { useLogout } from "@/lib/hooks/useLogout.ts";
import { useSendLoginMagicLink } from "@/lib/hooks/useSendLoginMagicLink.ts";
import { useUser } from "@/lib/hooks/useUser.ts";

export const Route = createFileRoute(
  "/_rallyists/_withUserProviderNoAutoAnonymous/login",
)({
  component: LoginPage,
});

type SigninForm = {
  email: string;
};

function LoginPage() {
  const { user } = useUser();
  const { isPending, mutate } = useSendLoginMagicLink();
  const { mutate: logout } = useLogout();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<SigninForm>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmitRegister: SubmitHandler<SigninForm> = async (data) => {
    try {
      console.log("data", data);
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

  // const isLoggedInAnonymous = user?.email === undefined;
  if (user) {
    const i18nKeyWarning =
      user.email === "" || user.email === undefined
        ? "anonymousLogoutWarning"
        : "loggedLogoutWarning";

    const i18nKeyButton =
      user.email === "" || user.email === undefined
        ? "anonymousLogoutButton"
        : "loggedLogoutButton";

    return (
      <>
        <Header>{t("login")}</Header>
        <div className={"flex flex-col grow justify-center"}>
          <p>
            <span>
              <Trans
                t={t}
                i18nKey={i18nKeyWarning}
                values={{ email: user.email, name: user.name }}
                components={{
                  1: <strong />,
                }}
              />
            </span>
            <br />
            {t("logoutBelow")}
          </p>
          <ButtonLink
            type={"button"}
            bg={"dangerous"}
            onClick={() => logout()}
            className={"text-lg"}
          >
            {t(i18nKeyButton)}
          </ButtonLink>
        </div>
      </>
    );
  }

  return (
    <>
      <Header>{t("login")}</Header>
      <div className={"flex flex-col grow justify-center"}>
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
    </>
  );
}
