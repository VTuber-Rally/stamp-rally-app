import { createFileRoute, Outlet } from "@tanstack/react-router";
import { UserProvider } from "@/lib/userContext.tsx";
import { StandistsNavbar } from "@/components/Navbar.tsx";

export const Route = createFileRoute("/standists")({
  component: () => (
    <UserProvider>
      <Outlet />
      <StandistsNavbar />
    </UserProvider>
  ),
});
