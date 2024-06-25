import { createFileRoute, Outlet } from "@tanstack/react-router";
import { UserProvider } from "@/lib/userContext.tsx";

export const Route = createFileRoute("/_rallyists/submit")({
  component: () => (
    <UserProvider registerAutoAnonymous={true}>
      <Outlet />
    </UserProvider>
  ),
});
