import { useQuery } from "@tanstack/react-query";

export function useContestQRCode() {
  const { data, isLoading } = useQuery({
    queryKey: ["contest-qr-code"],
    queryFn: () => "bah faut s'inscrire, duh",
  });

  return { data, isLoading };
}
