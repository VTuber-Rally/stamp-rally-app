import { createFileRoute, Outlet } from "@tanstack/react-router";
import { UserProvider } from "@/lib/userContext.tsx";

export const Route = createFileRoute(
  "/_rallyists/_withUserProviderNoAutoAnonymous",
)({
  component: () => (
    <UserProvider registerAutoAnonymous={false}>
      <Outlet />
    </UserProvider>
  ),
});
