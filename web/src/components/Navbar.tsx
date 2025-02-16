import { Link, useRouterState } from "@tanstack/react-router";
import clsx from "clsx";
import {
  Dices,
  Home,
  Map,
  QrCode,
  QrCodeIcon,
  UserPen,
  UsersRound,
} from "lucide-react";
import { FC, MouseEventHandler, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { useQRDrawerContext } from "@/context/useQRDrawerContext";
import { useUser } from "@/lib/hooks/useUser.ts";

const Navbar = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-navbar mb-0 bg-white border-t border-gray-300">
      <div className="flex h-full max-w-lg mx-auto divide-x divide-gray-200 font-medium">
        {children}
      </div>
    </div>
  );
};

type NavbarButtonProps = {
  onClick: MouseEventHandler;
  label: string;
  children: ReactNode;
  disabled?: boolean;
};

const NavbarButton: FC<NavbarButtonProps> = ({
  onClick,
  label,
  children,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "inline-flex flex-col items-center justify-center group grow w-4",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      {children}
      <span className="text-sm group-hover:text-blue-600 text-gray-500">
        {label}
      </span>
    </button>
  );
};

type NavBarElementProps = {
  to: string;
  label: string;
  children: ReactNode;
  disabled?: boolean;
};

const NavbarElement: FC<NavBarElementProps> = ({
  to,
  label,
  children,
  disabled = false,
}: NavBarElementProps) => {
  const {
    location: { pathname },
  } = useRouterState();
  const isActive = pathname === to;

  return (
    <Link
      to={to}
      type="button"
      activeProps={{ className: "bg-secondary-light hover:bg-secondary" }}
      inactiveProps={{ className: "hover:bg-gray-50" }}
      activeOptions={{ exact: true }}
      className={clsx(
        "inline-flex flex-col items-center justify-center group grow w-4",
        disabled && "opacity-50 cursor-not-allowed",
      )}
      disabled={disabled}
    >
      {children}
      <span
        className={clsx(
          "text-sm  group-hover:text-blue-600 text-center",
          isActive ? "text-black font-bold" : "text-gray-500",
        )}
      >
        {label}
      </span>
    </Link>
  );
};

export const RallyistNavbar = () => {
  const { t } = useTranslation();
  const [, setQRCodeDrawer] = useQRDrawerContext();

  return (
    <Navbar>
      <NavbarElement to={"/"} label={t("home")}>
        <Home className="w-5 h-5 mb-2 text-gray-500 group-hover:text-blue-600" />
      </NavbarElement>
      <NavbarElement to={"/artists"} label={t("artists")}>
        <UsersRound className="w-5 h-5 mb-2 text-gray-500 group-hover:text-blue-600" />
      </NavbarElement>
      <NavbarElement to={"/map"} label={t("map")}>
        <Map className="w-5 h-5 mb-2 text-gray-500 group-hover:text-blue-600" />
      </NavbarElement>
      <NavbarButton onClick={() => setQRCodeDrawer(true)} label={t("qrcode")}>
        <QrCodeIcon className="w-5 h-5 mb-2 text-gray-500  group-hover:text-blue-600" />
      </NavbarButton>
    </Navbar>
  );
};

export const StandistsNavbar = () => {
  const { user } = useUser();
  const { t } = useTranslation();

  const isLoggedIn = !!user;
  const isStandist = user?.labels.includes("standist");

  const disabled = !isLoggedIn || !isStandist;

  return (
    <Navbar>
      <NavbarElement to={"/standists"} label={t("home")}>
        <Home className="w-5 h-5 mb-2 text-gray-500 group-hover:text-blue-600" />
      </NavbarElement>
      <NavbarElement
        to={"/standists/qrcode"}
        label={t("qrcode")}
        disabled={disabled}
      >
        <QrCode className="w-5 h-5 mb-2 text-gray-500 group-hover:text-blue-600" />
      </NavbarElement>
      <NavbarElement
        to={"/standists/profile"}
        label={t("profile.label")}
        disabled={disabled}
      >
        <UserPen className="w-5 h-5 mb-2 text-gray-500 group-hover:text-blue-600" />
      </NavbarElement>
    </Navbar>
  );
};

export const StaffNavbar = () => {
  const { user } = useUser();
  const { t } = useTranslation();

  const isLoggedIn = !!user;
  const isStaff = user?.labels.includes("staff");

  const disabled = !isLoggedIn || !isStaff;

  return (
    <Navbar>
      <NavbarElement to={"/staff"} label={t("home")}>
        <Home className="w-5 h-5 mb-2 text-gray-500 group-hover:text-blue-600" />
      </NavbarElement>
      <NavbarElement
        to={"/staff/code"}
        label={t("checkSubmit")}
        disabled={disabled}
      >
        <QrCode className="w-5 h-5 sm:mb-2 text-gray-500 group-hover:text-blue-600" />
      </NavbarElement>
      <NavbarElement to={"/staff/wheel"} label={"Wheel"} disabled={disabled}>
        <Dices className="w-5 h-5 mb-2 text-gray-500 group-hover:text-blue-600" />
      </NavbarElement>
      <NavbarElement
        to={"/staff/gen-qrcode"}
        label={"Gen QR Code"}
        disabled={disabled}
      >
        <QrCode className="w-5 h-5 mb-2 text-gray-500 group-hover:text-blue-600" />
      </NavbarElement>
    </Navbar>
  );
};
