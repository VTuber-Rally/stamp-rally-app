import { FC, ReactNode } from "react";

export const MapButton: FC<{ children?: ReactNode; onClick?: () => void }> = ({
  children,
  onClick,
}) => {
  return (
    <button type="button" onClick={onClick} className="!p-[4.5px]">
      {children}
    </button>
  );
};
