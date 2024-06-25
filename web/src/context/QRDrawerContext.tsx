import { createContext, Dispatch, SetStateAction, useContext } from "react";

export const QRDrawerContext = createContext<
  [boolean, Dispatch<SetStateAction<boolean>>]
>([false, () => {}] as const);

export const useQRDrawerContext = () => useContext(QRDrawerContext);
