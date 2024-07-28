import { createContext, Dispatch, SetStateAction } from "react";

export const QRDrawerContext = createContext<
  [boolean, Dispatch<SetStateAction<boolean>>]
>([false, () => {}] as const);
