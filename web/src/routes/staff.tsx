import { Outlet, createFileRoute } from "@tanstack/react-router";

import { StaffNavbar } from "@/components/Navbar.tsx";
import { UserProvider } from "@/lib/userContext.tsx";

export const Route = createFileRoute("/staff")({
  component: () => (
    <UserProvider>
      <Outlet />
      <StaffNavbar />
    </UserProvider>
  ),
});
