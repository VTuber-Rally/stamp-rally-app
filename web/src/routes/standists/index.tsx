import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import StandistStaffHomePage from "@/components/StandistStaffHomePage.tsx";
import { ButtonLink } from "@/components/ButtonLink.tsx";
import { useUser } from "@/lib/userContext.tsx";

export const Route = createFileRoute("/standists/")({
  component: StandistsHome,
});

function StandistsHome() {
  const { t } = useTranslation();
  const { user } = useUser();
  const isStandist = user?.labels.includes("standist");

  return (
    <StandistStaffHomePage
      headerKey={"standistSpace"}
      loginTo={"/standists/signin"}
    >
      {isStandist ? (
        <ButtonLink size={"small"} href="/standists/qrcode">
          {t("generateQRCode")}
        </ButtonLink>
      ) : (
        <div>
          <h2>You're not a standist, are you?</h2>
        </div>
      )}
    </StandistStaffHomePage>
  );
}
