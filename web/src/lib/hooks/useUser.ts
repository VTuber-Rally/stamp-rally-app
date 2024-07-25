import { useContext } from "react";
import { UserContext } from "@/lib/userContext.tsx";

export const useUser = () => {
  const userCtx = UserContext;

  if (userCtx === null) {
    throw new Error("UserContext is not initialized");
  }

  const user = useContext(userCtx);

  return { ...user };
};
