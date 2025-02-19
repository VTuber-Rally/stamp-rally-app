import { createLazyFileRoute } from "@tanstack/react-router";

import SignInForm from "@/components/forms/SignInForm.tsx";

export const Route = createLazyFileRoute("/standists/signin")({
  component: StandistsSignin,
});

function StandistsSignin() {
  return <SignInForm navigateTo="/standists" />;
}
