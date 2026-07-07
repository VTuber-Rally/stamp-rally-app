import { captureException } from "@sentry/react";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useRef } from "react";
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
import QRScanner from "@/components/scan/QRScanner";
import { useQRDrawerContext } from "@/contexts/useQRDrawerContext.ts";
import { retrieveInfosFromQRCode } from "@/lib/StampQRCodes.ts";

export const QRCodeDrawer = () => {
  const [open, setOpen] = useQRDrawerContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const codeScanned = useRef(false);
  const [error, setError] = useState<Error | null>(null);

  useBlocker({
    shouldBlockFn: () => {
      if (open && !codeScanned.current) {
        setOpen(false);
        return true;
      }
      return false;
    },
    enableBeforeUnload: open,
  });

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
        <QRScanner
          onScanSuccess={(result) => {
            try {
              const { type, hash } = retrieveInfosFromQRCode(result.data);

              codeScanned.current = true;
              setOpen(false);
              navigate({
                to: "/code/$type",
                params: { type },
                hash,
              })
                .then(
                  () => {
                    window.plausible("QR scanned");
                  },
                  (error) => {
                    captureException(error);
                  },
                )
                .finally(() => {
                  codeScanned.current = false;
                });
            } catch (e) {
              if (e instanceof Error) setError(e);
            }
          }}
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
