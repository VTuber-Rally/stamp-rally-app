import clsx from "clsx";
import type { FC, MouseEventHandler, ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  onClick?: never;
  size?: "small" | "big";
  bg?: string;
  type?: "link";
  disabled?: boolean;
  target?: string;
};

export type ButtonLinkButtonProps = {
  children: ReactNode;
  href?: never;
  onClick: MouseEventHandler<HTMLButtonElement>;
  size?: "small" | "big";
  bg?: string;
  type: "button";
  disabled?: boolean;
  target?: never;
};

export const ButtonLink: FC<ButtonLinkProps | ButtonLinkButtonProps> = ({
  children,
  href,
  onClick,
  size = "big",
  bg = undefined,
  type = "link",
  disabled = false,
  target,
}) => {
  const className = clsx(
    "text-center text-black px-2 py-4 w-full max-w-xl flex justify-center items-center rounded-2xl font-bold",
    size === "big" && "h-20 text-2xl mt-4",
    size === "small" && "h-10 text-xl mt-2",
    bg == undefined && "bg-secondary",
    bg === "tertiary" && "bg-tertiary",
    bg === "successOrange" && "bg-successOrange",
    disabled && "opacity-75 cursor-not-allowed",
  );

  if (type === "button") {
    return (
      <button className={className} onClick={onClick} disabled={disabled}>
        {children}
      </button>
    );
  }

  return (
    <Link to={href} className={className} disabled={disabled} target={target}>
      {children}
    </Link>
  );
};
