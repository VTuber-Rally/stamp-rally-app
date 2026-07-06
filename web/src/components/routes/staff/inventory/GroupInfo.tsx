import { Trans, useTranslation } from "react-i18next";

import { GroupWithCardCount } from "@/lib/convex.ts";

interface GroupInfoProps {
  group: GroupWithCardCount;
  maxClassicCards: number;
  maxHoloCards: number;
  maxRandomClassicCards: number;
}

export function GroupInfo({
  group,
  maxClassicCards,
  maxHoloCards,
  maxRandomClassicCards,
}: GroupInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-3 text-center">
      <details>
        <summary className="text-lg font-semibold text-gray-800">
          {t("inventory.group", {
            groupId: group.indexNumber,
          })}
        </summary>
        <p className="text-sm text-gray-600">
          {t("inventory.groupDates", {
            start: new Date(group.start).toLocaleString(),
            end: new Date(group.end).toLocaleString(),
          })}
        </p>
        <p className="text-xs text-gray-500">
          {t("inventory.groupInfo", {
            numberOfCards: group.classicCardsPerDesign,
            numberOfHoloCards: group.holographicCardsPerDesign,
            coefficient: group.coefficient.toFixed(2),
          })}
        </p>
      </details>
      <hr className="my-2 border-gray-200" />
      <p className="text-sm text-gray-500">
        <Trans
          t={t}
          i18nKey="inventory.cart.stockLimit.maxCards"
          values={{
            classic: maxClassicCards,
            holo: maxHoloCards,
            random: maxRandomClassicCards,
          }}
          components={{
            b: <span className="font-bold" />,
          }}
        />
      </p>
    </div>
  );
}
