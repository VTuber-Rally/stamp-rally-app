import { createFileRoute } from "@tanstack/react-router";

import Wheel from "@/components/routes/staff/StaffWheel.tsx";

export const Route = createFileRoute("/staff/wheel")({
  component: Wheel,
});
