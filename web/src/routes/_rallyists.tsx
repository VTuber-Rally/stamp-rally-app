import { Outlet, createFileRoute } from "@tanstack/react-router";

import { RallyistNavbar } from "@/components/layout/Navbar.tsx";

export const Route = createFileRoute("/_rallyists")({
  component: () => (
    <>
      <Outlet />
      <RallyistNavbar />
    </>
  ),
});
