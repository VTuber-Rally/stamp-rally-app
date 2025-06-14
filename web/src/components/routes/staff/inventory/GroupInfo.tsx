import { Trans, useTranslation } from "react-i18next";

import type { Group } from "@vtube-stamp-rally/shared-lib/models/Inventory.ts";

interface GroupInfoProps {
  group: Group;
  maxClassicCards: number;
  maxHoloCards: number;
}

export function GroupInfo({
  group,
  maxClassicCards,
  maxHoloCards,
}: GroupInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-3">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          {t("inventory.group", {
            groupId: group.groupId,
          })}
        </h2>
        <p className="text-sm text-gray-600">
          {t("inventory.groupDates", {
            start: new Date(group.start).toLocaleString(),
            end: new Date(group.end).toLocaleString(),
          })}
        </p>
        <p className="text-xs text-gray-500">
          {t("inventory.groupInfo", {
            numberOfCards: group.numberOfCardsPerDesign,
            numberOfHoloCards: group.numberOfHoloCardsPerDesign,
            coefficient: group.coefficient.toFixed(2),
          })}
        </p>
        <hr className="my-2 border-gray-200" />
        <p className="text-sm text-gray-500">
          <Trans
            t={t}
            i18nKey="inventory.cart.stockLimit.maxCards"
            values={{
              classic: maxClassicCards,
              holo: maxHoloCards,
            }}
            components={{
              b: <span className="font-bold" />,
            }}
          />
        </p>
      </div>
    </div>
  );
}
