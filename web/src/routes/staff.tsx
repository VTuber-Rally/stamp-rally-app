import { Outlet, createFileRoute } from "@tanstack/react-router";

import { StaffNavbar } from "@/components/layout/Navbar.tsx";

export const Route = createFileRoute("/staff")({
  component: () => (
    <>
      <Outlet />
      <StaffNavbar />
    </>
  ),
});
