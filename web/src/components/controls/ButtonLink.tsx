import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import type { FC, MouseEventHandler, ReactNode } from "react";

type BaseButtonLinkProps = {
  children: ReactNode;
  size?: "small" | "medium" | "big";
  bg?: "secondary" | "tertiary" | "success-orange" | "dangerous";
  disabled?: boolean;
  className?: string;
};

export type ButtonLinkProps = BaseButtonLinkProps & {
  href: string;
  onClick?: never;
  type?: "link";
  target?: string;
};

export type ButtonLinkButtonProps = BaseButtonLinkProps & {
  href?: never;
  onClick: MouseEventHandler<HTMLButtonElement>;
  type: "button";
  target?: never;
};

export type ButtonLinkSubmitProps = BaseButtonLinkProps & {
  href?: never;
  onClick?: never;
  type: "submit";
  target?: never;
};

export const ButtonLink: FC<
  ButtonLinkProps | ButtonLinkButtonProps | ButtonLinkSubmitProps
> = ({
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
    size === "small" && "h-10 text-lg mt-2",
    (bg === undefined || bg === "secondary") && "bg-secondary",
    bg === "tertiary" && "bg-tertiary",
    bg === "success-orange" && "bg-success-orange",
    bg === "dangerous" && "bg-red-500/80",
    disabled && "opacity-75 cursor-not-allowed",
    className,
  );

  if (type === "button" || type === "submit") {
    return (
      <button
        className={combinedClassName}
        onClick={onClick}
        disabled={disabled}
        type={type}
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
