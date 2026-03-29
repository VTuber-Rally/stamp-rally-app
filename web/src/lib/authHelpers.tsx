import { useConvexAuth } from "convex/react";
import { FC, ReactNode } from "react";

import { useCurrentUser } from "@/lib/auth.ts";

/**
 * Auth helpers like the ones from "convex/react" but accounting for anon users.
 */

export const AuthenticatedNonAnonymously: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const { isLoading } = useConvexAuth();
  const user = useCurrentUser();

  if (isLoading) return null;
  if (!user || user.isAnonymous) return null;

  return <>{children}</>;
};

export const UnauthenticatedOrAnonymous: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const { isLoading } = useConvexAuth();
  const user = useCurrentUser();

  if (isLoading) return null;
  if (user && !user.isAnonymous) return null;

  return <>{children}</>;
};

export function AuthUserLoading({ children }: { children: ReactNode }) {
  const { isLoading } = useConvexAuth();
  const user = useCurrentUser();

  if (!isLoading && typeof user !== "undefined") {
    return null;
  }

  return <>{children}</>;
}
