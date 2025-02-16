import { createFileRoute } from "@tanstack/react-router";

import QRCodeGen from "@/components/routes/staff/QRCodeGen/QRCodeGen.tsx";

export const Route = createFileRoute("/staff/gen-qrcode/$userId")({
  component: QRCodeGenPage,
});

function QRCodeGenPage() {
  const { userId } = Route.useParams();

  return <QRCodeGen userId={userId} />;
}
