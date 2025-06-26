import QrScanner from "qr-scanner";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import QrFrame from "@/assets/qr-frame.svg";

interface QRScannerProps {
  onScanSuccess: (result: QrScanner.ScanResult) => void;
  onCameraAccessFail?: VoidFunction;
}

const QRScanner = ({ onScanSuccess, onCameraAccessFail }: QRScannerProps) => {
  const { t } = useTranslation();

  const qrScannerRef = useRef<QrScanner | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [qrOn, setQrOn] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const createQrScanner = useCallback(() => {
    if (!videoRef.current) return;

    const qrScanner = new QrScanner(
      videoRef.current,
      (result) => {
        try {
          onScanSuccess(result);
        } catch (error) {
          console.error("Erreur lors du traitement du scan QR:", error);
        }
      },
      {
        onDecodeError: (error) => {
          console.debug("Erreur de décodage QR (normale):", error);
        },
        preferredCamera: "environment",
        highlightScanRegion: false,
        highlightCodeOutline: false,
      },
    );

    return qrScanner;
  }, [onScanSuccess]);

  useEffect(() => {
    if (!videoRef.current) return;

    setIsLoading(true);

    const qrScanner = createQrScanner();
    if (!qrScanner) return;

    qrScannerRef.current = qrScanner;

    qrScanner
      .start()
      .then(() => {
        setQrOn(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Échec de l'accès à la caméra:", error);
        setQrOn(false);
        setIsLoading(false);
        onCameraAccessFail?.();
      });

    // Nettoyage lors du démontage
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }
    };
  }, [onScanSuccess, onCameraAccessFail, createQrScanner]);

  return (
    <div className="relative mx-auto w-full max-w-md">
      {isLoading && (
        <div className="bg-opacity-50 absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black">
          <div className="text-center text-white">
            <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
            <p className="text-sm">{t("qrScanner.loading")}</p>
          </div>
        </div>
      )}

      {/* Flux de la caméra, au format carré */}
      {qrOn && (
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            playsInline
            muted
          />
        </div>
      )}

      {/* Overlay avec cadre de scan */}
      {qrOn && !isLoading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <img
              src={QrFrame}
              alt={t("qrScanner.scanFrame")}
              className="h-64 w-64 opacity-90"
            />
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 transform whitespace-nowrap">
              <p className="bg-opacity-70 rounded-lg bg-black px-3 py-2 text-sm text-white">
                {t("qrScanner.instruction")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Message d'erreur si pas d'accès à la caméra */}
      {!qrOn && !isLoading && (
        <div className="flex aspect-square w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-center">
          <div>
            <p className="mb-2 text-gray-600">
              {t("qrScanner.noCameraAccess")}
            </p>
            <p className="text-xs text-gray-500">
              {t("qrScanner.checkPermissions")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
