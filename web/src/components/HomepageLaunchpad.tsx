import { Link, LinkProps } from "@tanstack/react-router";
import clsx from "clsx";
import {
  Cog,
  ListCheck,
  MapIcon,
  QrCode,
  Trophy,
  UsersRound,
} from "lucide-react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { useQRDrawerContext } from "@/contexts/useQRDrawerContext.ts";

const GridItem = ({
  title,
  link,
  onClick,
  icon,
  color,
  style,
  textStyle,
}: GridElement) => {
  const content = (
    <div
      className={clsx(
        "group flex items-center justify-center p-4 text-center shadow hover:shadow-md",
        color === "tertiary" ? `bg-tertiary` : `bg-secondary`,
        style,
      )}
    >
      {icon}
      <span className={clsx("text-lg font-medium text-gray-800", textStyle)}>
        {title}
      </span>
    </div>
  );

  if (link) return <Link to={link}>{content}</Link>;
  return (
    <button onClick={onClick} className="w-full cursor-pointer">
      {content}
    </button>
  );
};

type GridElementBase = {
  title: string;
  icon: ReactNode;
  color: "secondary" | "tertiary";
  style: string;
  textStyle?: string;
};

type GridElementLink = GridElementBase & {
  link: LinkProps["to"];
  onClick?: undefined;
};
type GridElementButton = GridElementBase & {
  onClick: () => void;
  link?: undefined;
};

type GridElement = GridElementLink | GridElementButton;

const HomepageLaunchpad = () => {
  const [, setQRCodeDrawerOpen] = useQRDrawerContext();
  const { t } = useTranslation();

  const gridElements: GridElement[] = [
    {
      title: t("artists"),
      link: "/artists",
      icon: <UsersRound className="mb-2 h-12 w-12 text-gray-800" />,
      color: "secondary",
      style: "rounded-tl-2xl flex-col",
      textStyle: "mt-2",
    },
    {
      title: t("map"),
      link: "/map",
      icon: <MapIcon className="mb-2 h-12 w-12 text-gray-800" />,
      color: "secondary",
      style: "rounded-tr-2xl flex-col",
      textStyle: "mt-2",
    },
    {
      title: t("reward.pageTitle"),
      link: "/reward",
      icon: <Trophy className="mb-2 h-12 w-12 text-gray-800" />,
      color: "secondary",
      style: "rounded-bl-2xl flex-col",
      textStyle: "mt-2",
    },
    {
      title: t("qrcode"),
      onClick: () => setQRCodeDrawerOpen(true),
      icon: <QrCode className="mb-2 h-12 w-12 text-gray-800" />,
      color: "tertiary",
      style: "rounded-br-2xl flex-col",
      textStyle: "mt-2",
    },
  ];

  const secondGridElements: GridElement[] = [
    {
      title: t("rules"),
      link: "/rules",
      icon: <ListCheck className="h-6 w-6 text-black" />,
      color: "secondary",
      style: "rounded-l-2xl flex-row justify-center content-center",
      textStyle: "ml-2",
    },
    {
      title: t("settings.title"),
      link: "/settings",
      icon: <Cog className="h-6 w-6 text-black" />,
      color: "secondary",
      style: "rounded-r-2xl flex-row justify-center",
      textStyle: "ml-2",
    },
  ];

  return (
    <>
      <div className={"mb-4 grid grid-cols-2 gap-1"}>
        {gridElements.map((element) => (
          <GridItem key={element.title} {...element} />
        ))}
      </div>
      <div className={"mb-4 grid grid-cols-2 gap-1"}>
        {secondGridElements.map((element) => (
          <GridItem key={element.title} {...element} />
        ))}
      </div>
    </>
  );
};

export default HomepageLaunchpad;
