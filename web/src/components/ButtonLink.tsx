import clsx from "clsx";
import type { FC, MouseEventHandler, ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  onClick?: never;
  size?: "small" | "medium" | "big";
  bg?: "secondary" | "tertiary" | "success-orange" | "dangerous";
  type?: "link";
  disabled?: boolean;
  target?: string;
  className?: string;
};

export type ButtonLinkButtonProps = {
  children: ReactNode;
  href?: never;
  onClick: MouseEventHandler<HTMLButtonElement>;
  size?: "small" | "medium" | "big";
  bg?: "secondary" | "tertiary" | "success-orange" | "dangerous";
  type: "button";
  disabled?: boolean;
  target?: never;
  className?: string;
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
  className = "",
}) => {
  const combinedClassName = clsx(
    "text-center text-black px-2 py-4 w-full max-w-xl flex justify-center items-center rounded-2xl font-bold",
    size === "big" && "h-20 text-2xl mt-4",
    size === "medium" && "h-15 text-xl mt-2",
    size === "small" && "h-10 text-xl mt-2",
    (bg === undefined || bg === "secondary") && "bg-secondary",
    bg === "tertiary" && "bg-tertiary",
    bg === "success-orange" && "bg-success-orange",
    bg === "dangerous" && "bg-red-500/80",
    disabled && "opacity-75 cursor-not-allowed",
    className,
  );

  if (type === "button") {
    return (
      <button
        className={combinedClassName}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }

  return (
    <Link
      to={href}
      className={combinedClassName}
      disabled={disabled}
      target={target}
    >
      {children}
    </Link>
  );
};
