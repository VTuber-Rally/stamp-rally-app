import { useAuthActions } from "@convex-dev/auth/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";

import Loader from "@/components/Loader.tsx";
import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import InputField from "@/components/inputs/InputField.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { withMagicLink } from "@/lib/auth.ts";
import { useToast } from "@/lib/hooks/useToast.ts";
import { useUser } from "@/lib/hooks/useUser.ts";

export const Route = createFileRoute("/_rallyists/login")({
  component: LoginPage,
});

type SigninForm = {
  email: string;
};

function LoginPage() {
  const { user } = useUser();
  const { signOut, signIn } = useAuthActions();
  const { t } = useTranslation();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { toast } = useToast();

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

  const onSubmit: SubmitHandler<SigninForm> = async (data) => {
    try {
      setIsSigningIn(true);
      clearErrors();
      await signIn(...withMagicLink(data.email))
        .then(() => {
          toast({
            title: t("loginMagicLinkToast.title"),
            description: t("loginMagicLinkToast.description"),
          });
        })
        .finally(() => {
          setIsSigningIn(false);
        });
    } catch (error) {
      console.error(error);
      setError("email", {
        type: "manual",
        message: "Invalid email",
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
        <div className={"flex grow flex-col justify-center"}>
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
            onClick={() => signOut()}
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
      <div className={"flex grow flex-col justify-center"}>
        <h1 className={"mb-4 text-3xl"}>{t("login")}</h1>
        <form className={"flex flex-col"} onSubmit={handleSubmit(onSubmit)}>
          <InputField
            type={"email"}
            name={"email"}
            placeholder={t("email")}
            register={register}
            errors={errors["email"]}
          />

          {isSigningIn ? (
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
    </>
  );
}
