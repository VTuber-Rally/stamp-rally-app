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

export const getAnonymousAccount = () =>
  ["anonymous", {}] satisfies SignInParam;

export const registerWithEmail = (
  email: string,
  data: Pick<User, "name" | "language" | "emailConsent">,
) => ["rallyist", { flow: "signUp", email, ...data }] satisfies SignInParam;

export const withMagicLink = (email: string) =>
  ["rallyist", { flow: "sendMagicLink", email }] satisfies SignInParam;
