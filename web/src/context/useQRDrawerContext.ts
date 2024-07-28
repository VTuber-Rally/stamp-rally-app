import { useContext } from "react";
import { QRDrawerContext } from "@/context/QRDrawerContext.tsx";

export const useQRDrawerContext = () => useContext(QRDrawerContext);
