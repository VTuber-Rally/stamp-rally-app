import { useEffect, useRef, useState } from "react";

// Qr Scanner
import QrScanner from "qr-scanner";
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
    <div className="h-[450px] w-[450px] max-w-full max-h-[50svh] grow">
      <video ref={videoEl} className="w-full h-full object-cover"></video>
      <div ref={qrBoxEl} className="w-full! left-0!">
        <img
          src={QrFrame}
          alt="QR code Frame"
          width={256}
          height={256}
          className="absolute fill-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
};

export default QrReader;
