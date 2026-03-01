import { useContext } from "react";

import { UserContext } from "@/lib/userContext.tsx";

export const useUser = () => {
  const userCtx = UserContext;

  const user = useContext(userCtx);

  return { ...user };
};
