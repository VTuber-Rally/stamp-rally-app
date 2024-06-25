import { createLazyFileRoute } from "@tanstack/react-router";
import SignInPage from "@/components/SignInPage.tsx";

export const Route = createLazyFileRoute("/staff/signin")({
  component: StaffSignin,
});

function StaffSignin() {
  return <SignInPage navigateTo="/staff" />;
}
