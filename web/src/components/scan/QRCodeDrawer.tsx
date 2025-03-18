import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
import { retrieveInfosFromQRCode } from "@/lib/StampQRCodes.ts";

export const QRCodeDrawer = () => {
  const [open, setOpen] = useQRDrawerContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState<Error | null>(null);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("scanQRDrawer.title")}</DrawerTitle>
          <DrawerDescription>{t("scanQRDrawer.description")}</DrawerDescription>
        </DrawerHeader>
        {error && (
          <p className="px-4 py-2 text-center text-red-600">{error.message}</p>
        )}
        <QrReader
          onScanSuccess={(result) => {
            try {
              const { type, hash } = retrieveInfosFromQRCode(result.data);

              setOpen(false);
              navigate({
                to: "/code/$type",
                params: { type },
                hash,
              });
            } catch (e) {
              if (e instanceof Error) setError(e);
            }
          }}
          onCameraAccessFail={() => console.log("oh no, no camera :(")}
        />
        <p className="px-4 py-2 text-center text-xs text-gray-600">
          {t("scanQRDrawer.nativeCameraHint")}
        </p>
        <DrawerFooter>
          <DrawerClose>{t("close")}</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
