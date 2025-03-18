import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/QueryKeys";
import { encodeContestSecretToQRCode } from "@/lib/StampQRCodes";
import { useDatabase } from "@/lib/hooks/useDatabase";

export function useContestQRCode() {
  const { getKeyValue } = useDatabase();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.CONTEST_SECRET],
    queryFn: async () => {
      const secret = await getKeyValue("contestRegistrationSecret");
      return encodeContestSecretToQRCode(secret.value);
    },
  });

  return { data, isLoading };
}
