import { useMutation } from "@tanstack/react-query";
import { useUser } from "@/lib/userContext.tsx";
import { useNavigate } from "@tanstack/react-router";

export const useLogin = (navigateTo: string) => {
  const { login: loginAuth } = useUser();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      await loginAuth(data.email, data.password),
    onSuccess: async () => {
      await navigate({ to: navigateTo });
    },
    networkMode: "online",
  });
};
