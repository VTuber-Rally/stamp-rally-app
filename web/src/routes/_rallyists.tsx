import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RallyistNavbar } from "@/components/Navbar.tsx";

export const Route = createFileRoute("/_rallyists")({
  component: () => (
    <>
      <Outlet />
      <RallyistNavbar />
    </>
  ),
});
