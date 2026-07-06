import { useQuery } from "convex/react";
import { Value } from "convex/values";

import { User, convexPublicApi } from "@/lib/convex.ts";

export const useCurrentUser = () => {
  return useQuery(convexPublicApi.users.loggedInUser);
};

/**
 * Helpers to use with convex auth actions
 */

type SignInParam = [string, Record<string, Value>];

export const withEmailAndPassword = (email: string, password: string) =>
  ["signIn", { flow: "signIn", email, password }] satisfies SignInParam;

export const getAnonymousAccount = (param: { language?: string } = {}) =>
  ["anonymous", param] satisfies SignInParam;

export const registerWithEmail = (
  email: string,
  data: Pick<User, "name" | "language" | "emailConsent">,
  enforceAnonymousUpgrade = false,
) =>
  [
    "rallyist",
    { flow: "signUp", email, enforceAnonymousUpgrade, ...data },
  ] satisfies SignInParam;

export const withMagicLink = (email: string) =>
  ["rallyist", { flow: "sendMagicLink", email }] satisfies SignInParam;
