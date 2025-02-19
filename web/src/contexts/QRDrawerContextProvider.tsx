import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from "react";

import { QRDrawerContext } from "@/contexts/QRDrawerContext.tsx";

export const QRDrawerContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const contextValue = useMemo<[boolean, Dispatch<SetStateAction<boolean>>]>(
    () => [open, setOpen],
    [open],
  );

  return (
    <QRDrawerContext.Provider value={contextValue}>
      {children}
    </QRDrawerContext.Provider>
  );
};
