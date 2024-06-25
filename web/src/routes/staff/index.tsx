import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@/lib/userContext.tsx";
import { useTranslation } from "react-i18next";
import { ButtonLink } from "@/components/ButtonLink.tsx";
import StandistStaffHomePage from "@/components/StandistStaffHomePage.tsx";

export const Route = createFileRoute("/staff/")({
  component: StandistsHome,
});

function StandistsHome() {
  const { user } = useUser();
  const { t } = useTranslation();
  const isStaff = user?.labels.includes("staff");

  return (
    <StandistStaffHomePage headerKey={"staffSpace"} loginTo={"/staff/signin"}>
      {isStaff ? (
        <ButtonLink size={"small"} href="/staff/code">
          {t("checkSubmit")}
        </ButtonLink>
      ) : (
        <h2>Vous n'êtes pas du staff !</h2>
      )}
    </StandistStaffHomePage>
  );
}
