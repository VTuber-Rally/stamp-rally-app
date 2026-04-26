import { useNavigate } from "@tanstack/react-router";
import {
  CircleAlert,
  Loader2,
  MessageSquare,
  TicketX,
  TriangleAlert,
  Upload,
} from "lucide-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/layout/Drawer.tsx";
import { RallyProgressBar } from "@/components/reward/RallyProgressBar.tsx";
import { RewardsAvailabilityList } from "@/components/reward/RewardsAvailabilityList.tsx";
import { standardRewardMinStampsRequirement } from "@/lib/consts.ts";
import { useRewardAvailability } from "@/lib/hooks/useRewardAvailability.ts";
import { useSubmitRally } from "@/lib/hooks/useSubmitRally.ts";

interface SubmitDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const SubmitDrawer: FC<SubmitDrawerProps> = ({ open, setOpen }) => {
  const { t } = useTranslation();
  const {
    isStandardRewardObtainable,
    isPremiumRewardObtainable,
    isAnyStampFromMinorHall,
    stampCount,
  } = useRewardAvailability();
  const navigate = useNavigate();

  const { submitRally, error, isLoading } = useSubmitRally();

  const handleSubmit = () => {
    void submitRally().then(() => navigate({ to: "/reward/submissions" }));
  };

  const canSubmit = isStandardRewardObtainable && !error;

  return (
    <Drawer open={open} onOpenChange={setOpen} dismissible={!isLoading}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("currentRallyBlock.submitDrawerTitle")}</DrawerTitle>
          <DrawerDescription>
            {t("currentRallyBlock.submitDrawerDescription")}
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4">
          <RallyProgressBar />
          <RewardsAvailabilityList />
          {!isPremiumRewardObtainable && (
            <p className="flex items-center gap-2 py-2 text-sm text-gray-700">
              <TriangleAlert className="inline-block shrink-0" size={24} />
              <span>{t("currentRallyBlock.resetDisclaimer")}</span>
            </p>
          )}
          {error && (
            <>
              <p className="flex items-center gap-2 py-2 font-bold text-red-600">
                <CircleAlert className="inline-block shrink-0" size={24} />
                <span>{error?.message ?? String(error)}</span>
              </p>
              <p className="flex items-center gap-2 py-2 text-red-600">
                <MessageSquare className="inline-block shrink-0" size={24} />
              </p>
            </>
          )}
          {canSubmit && (
            <ButtonLink
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              size="medium"
            >
              {isLoading ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                <Upload className="mr-2" />
              )}
              {t("currentRallyBlock.submitAction")}
            </ButtonLink>
          )}
          {!isStandardRewardObtainable && (
            <p className="flex items-center gap-2 py-2 font-bold text-red-600">
              <TicketX className="inline-block shrink-0" size={24} />
              <span>
                {stampCount < standardRewardMinStampsRequirement &&
                  t("submitNotAllowed.count", {
                    stamps: standardRewardMinStampsRequirement,
                  })}
                {!isAnyStampFromMinorHall &&
                  " " +
                    t("submitNotAllowed.minorHall", {
                      stamps: standardRewardMinStampsRequirement,
                    })}
              </span>
            </p>
          )}
        </div>
        <DrawerFooter>
          <DrawerClose>{t("close")}</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
