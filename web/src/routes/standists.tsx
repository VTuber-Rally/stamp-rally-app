import { Outlet, createFileRoute } from "@tanstack/react-router";

import { StandistsNavbar } from "@/components/layout/Navbar.tsx";

export const Route = createFileRoute("/standists")({
  component: () => (
    <>
      <Outlet />
      <StandistsNavbar />
    </>
  ),
});
