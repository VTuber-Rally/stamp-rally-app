import { FC, ReactNode } from "react";

export const MapButton: FC<{ children?: ReactNode; onClick?: () => void }> = ({
  children,
  onClick,
}) => {
  return (
    <button type="button" onClick={onClick} className="p-[calc(9px/2)]!">
      {children}
    </button>
  );
};
