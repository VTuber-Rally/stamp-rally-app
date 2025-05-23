import { createFileRoute, useNavigate } from "@tanstack/react-router";

import QrReader from "@/components/scan/QrReader.tsx";

export const Route = createFileRoute("/staff/code")({
  component: CheckCode,
});

function CheckCode() {
  const navigate = useNavigate();

  return (
    <div className="flex grow flex-col items-center justify-center">
      <QrReader
        onScanSuccess={(result) => {
          const submissionId = result.data;

          void navigate({
            to: `/staff/submission/${submissionId}`,
          });
        }}
        onCameraAccessFail={() => console.log("oh no, no camera :(")}
      />
    </div>
  );
}
