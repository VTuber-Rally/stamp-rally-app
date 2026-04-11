import { useAuthActions } from "@convex-dev/auth/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { useCurrentUser } from "@/lib/auth.ts";

type StandistsHomeProps = {
  headerKey: string;
  loginTo: string;
  children: ReactNode;
};

const StandistsHome: FC<StandistsHomeProps> = ({
  headerKey,
  loginTo,
  children,
}) => {
  const { signOut } = useAuthActions();
  const user = useCurrentUser();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex grow flex-col">
      <Header>{t(headerKey)}</Header>
      <div className={"flex grow flex-col items-center justify-center"}>
        {user ? (
          <div className={"flex flex-col space-y-4"}>
            <h1 className={"text-xl"}>
              {t("hi_username", { name: user.name })} ({user.email})
            </h1>

            {children}

            <ButtonLink size="small" type="button" onClick={() => signOut()}>
              {t("logout")}
            </ButtonLink>
          </div>
        ) : (
          <div className={"flex flex-col items-center"}>
            <h2 className={"text-2xl"}>{t("notLoggedIn")}</h2>
            <ButtonLink
              size="small"
              bg="tertiary"
              type="button"
              onClick={() =>
                navigate({
                  to: loginTo,
                })
              }
            >
              {t("login")}
            </ButtonLink>
          </div>
        )}
        <div>
          <hr className={"my-4"} />
          <Link to={"/"}>{t("home")}</Link>
        </div>
      </div>
    </div>
  );
};

export default StandistsHome;
