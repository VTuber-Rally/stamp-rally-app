import { useQuery } from "@tanstack/react-query";
import { useUser } from "../userContext.tsx";
import { QUERY_KEYS } from "../QueryKeys.ts";
import { encodeStampToQRCode } from "@/lib/StampQRCodes.ts";
import { signData } from "@/lib/signatures.ts";

function usePrivateKey() {
  const { user } = useUser();

  const { data: privateKey } = useQuery({
    queryKey: [QUERY_KEYS.PRIVATE_KEY],
    queryFn: () => {
      if (!user || !user.prefs.privateKey) return null;

      const key = JSON.parse(user.prefs.privateKey) as JsonWebKey;

      return window.crypto.subtle.importKey(
        "jwk",
        key,
        {
          name: "ECDSA",
          namedCurve: "P-384",
        },
        true,
        ["sign"],
      );
    },
    enabled: !!user,
  });

  return privateKey;
}

export function useQrCode() {
  const { user } = useUser();
  const privateKey = usePrivateKey();

  const { isLoading, error, data } = useQuery({
    queryKey: [QUERY_KEYS.NEW_QR_CODE],
    queryFn: async () => {
      if (!privateKey || !user) return undefined;

      const data = [user.$id, Date.now()] as const;
      const signature = await signData(privateKey, data);

      const codeData = encodeStampToQRCode([...data, signature]);

      return {
        codeData,
      };
    },
    refetchInterval: 5 * 1000,
    staleTime: 1000 * 60,
    enabled: !!privateKey,
  });

  return { isLoading, error, data };
}
