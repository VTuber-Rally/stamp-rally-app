import { createLazyFileRoute } from "@tanstack/react-router";

import SignInForm from "@/components/forms/SignInForm.tsx";

export const Route = createLazyFileRoute("/staff/signin")({
  component: StaffSignin,
});

function StaffSignin() {
  return <SignInForm navigateTo="/staff" />;
}
