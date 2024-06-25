import { createFileRoute, Outlet } from "@tanstack/react-router";
import { UserProvider } from "@/lib/userContext.tsx";
import { StaffNavbar } from "@/components/Navbar.tsx";

export const Route = createFileRoute("/staff")({
  component: () => (
    <UserProvider>
      <Outlet />
      <StaffNavbar />
    </UserProvider>
  ),
});
