import { skipToken, useQuery } from "@tanstack/react-query";

import { signData } from "@vtube-stamp-rally/shared-lib/signatures.ts";

import { encodeStampToQRCode } from "@/lib/StampQRCodes.ts";
import { useUser } from "@/lib/hooks/useUser.ts";

import { QUERY_KEYS } from "../QueryKeys.ts";

function usePrivateKey() {
  const { user } = useUser();

  const { data: privateKey } = useQuery({
    queryKey: [QUERY_KEYS.PRIVATE_KEY],
    queryFn: user
      ? () => {
          if (
            !user.prefs.privateKey ||
            typeof user?.prefs.privateKey !== "string"
          )
            throw new Error("No private key");

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
        }
      : skipToken,
  });

  return privateKey;
}

export function useQrCode() {
  const { user } = useUser();
  const privateKey = usePrivateKey();

  const { isLoading, error, data } = useQuery({
    queryKey: [QUERY_KEYS.NEW_QR_CODE],
    queryFn:
      privateKey && user
        ? async () => {
            const expiryTimestamp = Date.now() + 2 * 60 * 1000; // 2 minutes comme avant
            const data = [user.$id, expiryTimestamp] as const;
            const signature = await signData(privateKey, data);

            const codeData = encodeStampToQRCode([...data, signature]);

            return {
              codeData,
            };
          }
        : skipToken,
    refetchInterval: 5 * 1000,
    staleTime: 1000 * 60,
  });

  return { isLoading, error, data };
}
