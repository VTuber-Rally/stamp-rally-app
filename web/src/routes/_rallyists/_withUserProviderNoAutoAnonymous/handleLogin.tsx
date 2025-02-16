import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import Loader from "@/components/Loader.tsx";
import { appwriteProjectId } from "@/lib/consts.ts";
import { useToast } from "@/lib/hooks/useToast.ts";
import { useUser } from "@/lib/hooks/useUser.ts";

export const Route = createFileRoute(
  "/_rallyists/_withUserProviderNoAutoAnonymous/handleLogin",
)({
  gcTime: 0,
  loader: async ({ location: { search } }) => {
    if (!hasQueryParams(search)) {
      throw new Error("Invalid query params");
    }

    const { secret, userId, expire, project } = search;

    // check if the projet is the right one
    if (appwriteProjectId !== project) {
      throw new Error("Invalid project");
    }

    // check if the token is still valid
    const expireDate = new Date(expire);
    if (expireDate < new Date()) {
      throw new Error("Token expired");
    }

    return { secret, userId };
  },
  errorComponent: () => <>Une erreur est survenue. Veuillez réessayer.</>,
  component: HandleLogin,
});

type SignInQueryParams = {
  secret: string;
  userId: string;
  expire: string;
  project: string;
};

const hasQueryParams = (
  search: Partial<SignInQueryParams>,
): search is SignInQueryParams => {
  const { secret, userId, expire, project } = search;
  return !!secret && !!userId && !!expire && !!project;
};

function HandleLogin() {
  const { secret, userId } = Route.useLoaderData();
  const { user, registerMagicLink } = useUser();
  const { toast } = useToast();
  const { t } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    // login
    console.log("logging in with", userId, secret);
    try {
      if (!user) {
        registerMagicLink(userId, secret);
        navigate({ to: "/settings" });
      } else {
        if (user.$id === userId) {
          console.log("Already logged in", user);

          toast({
            title: "Déjà connecté",
            description: "Vous êtes déjà connecté",
            type: "foreground",
          });
        }
        navigate({ to: "/settings" });
      }
    } catch (error) {
      console.log("Error with login", error);
      redirect({ to: "/settings", throw: true });
    }
    // we don't want to run this on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grow flex flex-col items-center justify-center">
      <div className="flex flex-col justify-center items-center gap-2">
        <Loader size={5} />
        <h1>{t("loggingIn")}</h1>
      </div>
    </div>
  );
}
