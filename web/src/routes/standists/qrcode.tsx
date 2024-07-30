import { createFileRoute } from "@tanstack/react-router";
import StandistsQRCodeGeneratorPage from "@/components/routes/standists/StandistsQRCodeGeneratorPage.tsx";

export const Route = createFileRoute("/standists/qrcode")({
  component: StandistsQRCodeGeneratorPage,
});
