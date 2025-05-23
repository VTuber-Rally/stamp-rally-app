// Qr Scanner
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";

import QrFrame from "@/assets/qr-frame.svg";

export type QrReaderProps = {
  onScanSuccess: (result: QrScanner.ScanResult) => void;
  onCameraAccessFail: () => void;
};

const QrReader = ({ onScanSuccess, onCameraAccessFail }: QrReaderProps) => {
  // QR States
  const scanner = useRef<QrScanner | null>(null);
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);

  const onScanFail = (err: string | Error) => {
    console.log(err);
  };

  useEffect(() => {
    if (videoEl.current && !scanner.current) {
      scanner.current = new QrScanner(
        videoEl?.current,
        (result) => {
          scanner.current?.stop();
          onScanSuccess(result);
        },
        {
          onDecodeError: onScanFail,
          preferredCamera: "environment",
          highlightScanRegion: true,
          highlightCodeOutline: true,
          overlay: qrBoxEl?.current || undefined,
        },
      );

      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    return () => {
      scanner?.current?.stop();
      scanner.current = null;
    };
  }, [onScanSuccess]);

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn) onCameraAccessFail();
  }, [qrOn, onCameraAccessFail]);

  return (
    <div className="h-[450px] max-h-[50svh] w-[450px] max-w-full grow">
      <video ref={videoEl} className="h-full w-full object-cover"></video>
      <div ref={qrBoxEl} className="left-0! w-full!">
        <img
          src={QrFrame}
          alt="QR code Frame"
          width={256}
          height={256}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-none"
        />
      </div>
    </div>
  );
};

export default QrReader;
