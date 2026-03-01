import {
  convexClient,
  crossDomainClient,
} from "@convex-dev/better-auth/client/plugins";
import { anonymousClient, magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { useQuery } from "convex/react";
import { api } from "~/_generated/api";

import { convexSiteURL } from "@/lib/consts.ts";
import { generatePassword } from "@/lib/password.ts";

export const authClient = createAuthClient({
  baseURL: convexSiteURL,
  plugins: [
    convexClient(),
    crossDomainClient(),
    anonymousClient(),
    magicLinkClient(),
  ],
});

window.authClient = authClient;

export function useCurrentUser() {
  const session = authClient.useSession();
  const user = useQuery(api.auth.getCurrentUser);

  if (session.isPending || !user) return null;

  return user;
}

export async function loginWithEmailAndPassword(
  email: string,
  password: string,
) {
  return authClient.signIn.email({ email, password });
}

export function loginAnonymous() {
  return authClient.signIn.anonymous();
}

export function loginWithEmailAndMagicLink(email: string) {
  return authClient.signIn.magicLink({ email, callbackURL: "/settings" });
}

export function signUpWithEmail(email: string, name?: string) {
  // Circumvent the mandatory password in betterauth account record by generating a random one.
  const password = generatePassword();
  return authClient.signUp.email({
    name: name || email,
    email,
    password,
  });
}

export function logout() {
  return authClient.signOut();
}
