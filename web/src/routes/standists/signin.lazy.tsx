import { createLazyFileRoute } from "@tanstack/react-router";
import SignInPage from "@/components/SignInPage.tsx";

export const Route = createLazyFileRoute("/standists/signin")({
  component: StandistsSignin,
});

function StandistsSignin() {
  return <SignInPage navigateTo="/standists" />;
}
