import { Stamp } from "@/lib/models/Stamp.ts";
import { FC, PropsWithChildren } from "react";
import {
  CalendarCogIcon,
  Printer,
  ScanSearch,
  ShieldCheck,
  TicketMinus,
  TicketPlus,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Standist } from "@/lib/models/Standist.ts";

type StampDetailsProps = {
  stamp: Stamp;
  standist: Standist;
};

const StampLine: FC<PropsWithChildren> = ({ children }) => {
  return <li className="flex gap-2">{children}</li>;
};

export const StampDetails: FC<StampDetailsProps> = ({ stamp, standist }) => {
  const { t } = useTranslation();

  return (
    <details
      className="border-dashed border-4 border-secondaryLight p-2 group"
      data-testid="stamps-details"
    >
      <summary className="flex justify-center items-center gap-1 group-open:pb-2 select-none">
        <TicketPlus className="group-open:hidden" />
        <TicketMinus className="hidden group-open:block" />
        {t("stampDetails.summary")}
      </summary>
      <ul className="space-y-1">
        {stamp.timestamp === -1 ? (
          <StampLine>
            <Printer />
            {t("stampDetails.paperStamp")}
          </StampLine>
        ) : (
          <StampLine>
            <CalendarCogIcon />
            {t("stampDetails.generatedAt", {
              dateTime: new Date(stamp.timestamp).toLocaleString(undefined, {
                dateStyle: "long",
                timeStyle: "medium",
              }),
            })}
          </StampLine>
        )}
        <StampLine>
          <ScanSearch />
          {t("stampDetails.scannedAt", {
            dateTime: new Date(stamp.scanTimestamp).toLocaleString(undefined, {
              dateStyle: "long",
              timeStyle: "medium",
            }),
          })}
        </StampLine>
        <StampLine>
          <ShieldCheck />
          {t("stampDetails.signedBy", { name: standist.name })}
        </StampLine>
      </ul>
    </details>
  );
};
