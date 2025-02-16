import clsx from "clsx";
import { FC, ReactNode } from "react";

type HeaderProps = {
  className?: string;
  children: ReactNode;
};

export const Header: FC<HeaderProps> = ({ className, children }) => {
  return (
    <h1
      className={clsx(
        "flex items-center justify-center text-center",
        "min-h-20 w-full break-words text-black",
        "mb-2 p-4 text-3xl font-bold",
        className,
      )}
    >
      {children}
    </h1>
  );
};
