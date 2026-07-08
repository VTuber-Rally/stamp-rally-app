import { QrCode, Stamp } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

import { standardRewardMinStampsRequirement } from "@/lib/consts";

const Intro = () => {
  const { t } = useTranslation();
  return (
    <div className={"rounded-xl bg-secondary-light/10 p-2"}>
      <div className="flex items-center justify-center py-2">
        <span className="text-2xl font-bold">{t("rally.welcome")}</span>
      </div>
      <ul className={"space-y-2 py-2"}>
        <li className={"flex items-center"}>
          <QrCode size={36} className={"mr-2 shrink-0"} />
          <span>{t("rally.1")}</span>
        </li>
        <li className={"flex items-center"}>
          <Stamp size={36} className={"mr-2 shrink-0"} />
          <span>
            <Trans
              t={t}
              i18nKey="rally.2"
              components={{
                1: <strong />,
              }}
              values={{
                minimumStampsCount: standardRewardMinStampsRequirement,
              }}
            />
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Intro;
