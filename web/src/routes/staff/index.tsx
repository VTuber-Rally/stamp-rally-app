import { createFileRoute } from "@tanstack/react-router";
import { Package, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import StandistStaffHomePage from "@/components/routes/standists/StandistStaffHomePage.tsx";
import { useUser } from "@/lib/hooks/useUser.ts";

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
        <>
          {" "}
          <ButtonLink size={"small"} href="/staff/code">
            {t("checkSubmit")}
          </ButtonLink>
          <ButtonLink size={"small"} href={"/staff/reward"}>
            <Sparkles className="inline-block" /> Récompense
          </ButtonLink>
          <ButtonLink size={"small"} href={"/staff/inventory"}>
            <Package className="inline-block" /> Inventaire
          </ButtonLink>
        </>
      ) : (
        <h2>Vous n'êtes pas du staff !</h2>
      )}
    </StandistStaffHomePage>
  );
}
