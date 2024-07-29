import { FC, ReactNode } from "react";
import clsx from "clsx";

type HeaderProps = {
  className?: string;
  children: ReactNode;
};

export const Header: FC<HeaderProps> = ({ className, children }) => {
  return (
    <h1
      className={clsx(
        "flex justify-center items-center text-center",
        "break-words text-black min-h-20 w-full",
        "p-4 mb-2 text-3xl font-bold",
        className,
      )}
    >
      {children}
    </h1>
  );
};
