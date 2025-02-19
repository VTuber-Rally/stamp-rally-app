import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/layout/Drawer.tsx";
import QrReader from "@/components/scan/QrReader.tsx";
import { useQRDrawerContext } from "@/contexts/useQRDrawerContext.ts";
import { retrieveHashFromQRCode } from "@/lib/StampQRCodes.ts";

export const QRCodeDrawer = () => {
  const [open, setOpen] = useQRDrawerContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("scanQRDrawer.title")}</DrawerTitle>
          <DrawerDescription>{t("scanQRDrawer.description")}</DrawerDescription>
        </DrawerHeader>
        <QrReader
          onScanSuccess={(result) => {
            const hash = retrieveHashFromQRCode(result.data);

            setOpen(false);
            navigate({
              to: "/code",
              hash,
            });
          }}
          onCameraAccessFail={() => console.log("oh no, no camera :(")}
        />
        <DrawerFooter>
          <DrawerClose>{t("close")}</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
