import { Gift, ShoppingBag, TicketCheck } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

export const MapLegend = () => {
  const { t } = useTranslation();

  return (
    <ul className="space-y-2">
      <li className="flex gap-1">
        <TicketCheck className="inline-block shrink-0 text-green-700" />{" "}
        <div>
          <Trans
            t={t}
            i18nKey={"mapLegend.green"}
            components={{ 1: <span className="text-green-700" /> }}
          />
        </div>
      </li>
      <li className="flex gap-1">
        <ShoppingBag className="inline-block shrink-0 text-blue-500" />
        <div>
          <Trans
            t={t}
            i18nKey={"mapLegend.blue"}
            components={{ 1: <span className="text-blue-500" /> }}
          />
        </div>
      </li>
      <li className="flex gap-1">
        <Gift className="inline-block shrink-0 text-yellow-600" />
        <div>
          <Trans
            t={t}
            i18nKey={"mapLegend.yellow"}
            components={{ 1: <span className="text-yellow-600" /> }}
          />
        </div>
      </li>
    </ul>
  );
};
