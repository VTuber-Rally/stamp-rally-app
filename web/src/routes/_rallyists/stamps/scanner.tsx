import { createFileRoute, useNavigate } from "@tanstack/react-router";

import QrReader from "@/components/QrReader.tsx";
import { retrieveHashFromQRCode } from "@/lib/StampQRCodes.ts";

export const Route = createFileRoute("/_rallyists/stamps/scanner")({
  component: Scanner,
});

function Scanner() {
  const navigate = useNavigate();

  return (
    <div className="flex grow flex-col items-center justify-center">
      <QrReader
        onScanSuccess={(result) => {
          const hash = retrieveHashFromQRCode(result.data);

          navigate({
            to: "/code",
            hash,
          });
        }}
        onCameraAccessFail={() => console.log("oh no, no camera :(")}
      />
    </div>
  );
}
