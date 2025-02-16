import { createFileRoute } from "@tanstack/react-router";

import QRCodeGenArtistsList from "@/components/routes/staff/QRCodeGen/QRCodeGenArtistsList.tsx";

export const Route = createFileRoute("/staff/gen-qrcode/")({
  component: QRCodeGenArtistsList,
});
