import { Outlet, createFileRoute } from "@tanstack/react-router";

import { StandistsNavbar } from "@/components/layout/Navbar.tsx";
import { UserProvider } from "@/lib/userContext.tsx";

export const Route = createFileRoute("/standists")({
  component: () => (
    <UserProvider>
      <Outlet />
      <StandistsNavbar />
    </UserProvider>
  ),
});
