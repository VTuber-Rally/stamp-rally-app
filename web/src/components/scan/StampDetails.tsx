import { ScanSearch, ShieldCheck, TicketMinus, TicketPlus } from "lucide-react";
import { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

import type { Stamp } from "@vtube-stamp-rally/shared-lib/models/Stamp.ts";
import type { Standist } from "@vtube-stamp-rally/shared-lib/models/Standist.ts";

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
      className="group border-4 border-dashed border-secondary-light p-2"
      data-testid="stamps-details"
    >
      <summary className="flex items-center justify-center gap-1 select-none group-open:pb-2">
        <TicketPlus className="group-open:hidden" />
        <TicketMinus className="hidden group-open:block" />
        {t("stampDetails.summary")}
      </summary>
      <ul className="space-y-1">
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
