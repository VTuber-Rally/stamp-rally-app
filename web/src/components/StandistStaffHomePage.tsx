import { Link, useNavigate } from "@tanstack/react-router";
import { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/Header.tsx";
import { useUser } from "@/lib/hooks/useUser.ts";

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
  const { user, logout } = useUser();
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

            <button
              className="rounded-xl bg-secondary p-2 text-black"
              type="button"
              onClick={() => logout()}
            >
              {t("logout")}
            </button>
          </div>
        ) : (
          <div className={"flex flex-col items-center"}>
            <h2 className={"text-2xl"}>{t("notLoggedIn")}</h2>
            <button
              className="mt-2 rounded-xl bg-tertiary p-3 text-2xl text-black"
              type="button"
              onClick={() =>
                navigate({
                  to: loginTo,
                })
              }
            >
              {t("login")}
            </button>
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
