import { useContext } from "react";

import { QRDrawerContext } from "@/contexts/QRDrawerContext.tsx";

export const useQRDrawerContext = () => useContext(QRDrawerContext);
