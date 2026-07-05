import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import StandistStaffHomePage from "@/components/routes/standists/StandistStaffHomePage.tsx";
import { useCurrentUser } from "@/lib/auth.ts";
import { User } from "@/lib/convex.ts";

export const Route = createFileRoute("/standists/")({
  component: StandistsHome,
});

function StandistsHome() {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const isStandist =
    (["staff", "standist"] as User["role"][]).includes(user?.role) &&
    user?.boothId;

  return (
    <StandistStaffHomePage
      headerKey={"standistSpace"}
      loginTo={"/standists/signin"}
    >
      {isStandist ? (
        <>
          <ButtonLink size={"small"} href="/standists/qrcode">
            {t("generateQRCode")}
          </ButtonLink>
          <ButtonLink size={"small"} href="/standists/profile">
            {t("profile.label")}
          </ButtonLink>
        </>
      ) : (
        <div>
          <h2>You're not a standist, are you?</h2>
        </div>
      )}
    </StandistStaffHomePage>
  );
}
