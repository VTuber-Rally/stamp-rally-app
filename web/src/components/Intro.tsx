import {
  Calendar,
  Dices,
  QrCode,
  Repeat,
  TicketCheck,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Intro = () => {
  const { t } = useTranslation();
  return (
    <div className={"bg-secondaryLight bg-opacity-10 p-2 rounded-xl"}>
      <ul className={"py-2 space-y-2"}>
        <li className={"flex items-center"}>
          <Users size={36} className={"mr-2 shrink-0"} />
          <span>{t("rally.1")}</span>
        </li>
        <li className={"flex items-center"}>
          <QrCode size={36} className={"mr-2 shrink-0"} />
          <span>{t("rally.2")}</span>
        </li>
        <li className={"flex items-center"}>
          <TicketCheck size={36} className={"mr-2 shrink-0"} />
          <span>{t("rally.3")}</span>
        </li>
        <li className={"flex items-center"}>
          <Dices size={36} className={"mr-2 shrink-0"} />
          <span>{t("rally.4")}</span>
        </li>
        <li className={"flex items-center"}>
          <Repeat size={36} className={"mr-2 shrink-0"} />
          <span>{t("rally.5")}</span>
        </li>
        <li className={"flex items-center"}>
          <Calendar size={36} className={"mr-2 shrink-0"} />
          <span>{t("rally.6")}</span>
        </li>
      </ul>
    </div>
  );
};

export default Intro;
