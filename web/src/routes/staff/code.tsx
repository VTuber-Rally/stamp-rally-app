import { createFileRoute, useNavigate } from "@tanstack/react-router";

import QRScanner from "@/components/scan/QRScanner";

export const Route = createFileRoute("/staff/code")({
  component: CheckCode,
});

function CheckCode() {
  const navigate = useNavigate();

  return (
    <div className="flex grow flex-col items-center justify-center">
      <QRScanner
        onScanSuccess={(result) => {
          const submissionId = result.data;

          void navigate({
            to: `/staff/submission/${submissionId}`,
          });
        }}
      />
    </div>
  );
}
