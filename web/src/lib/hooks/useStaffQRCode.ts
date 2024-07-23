import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../QueryKeys.ts";
import { encodeStampToQRCode } from "@/lib/StampQRCodes.ts";
import { signData } from "@/lib/signatures.ts";
import { functions } from "@/lib/appwrite.ts";
import { getPrivateKeyFunctionId } from "@/lib/consts.ts";

function usePrivateKey(userId: string, key?: JsonWebKey) {
  const { data: privateKey } = useQuery({
    queryKey: [QUERY_KEYS.PRIVATE_KEY, userId],
    queryFn: async () => {
      console.log("key", key);
      if (!key) return null;

      console.log("importing key", key, typeof key);

      console.time("importKey");

      const keyImported = await window.crypto.subtle.importKey(
        "jwk",
        key,
        {
          name: "ECDSA",
          namedCurve: "P-384",
        },
        true,
        ["sign"],
      );

      console.timeEnd("importKey");

      console.log("imported key", keyImported);

      return keyImported;
    },
    enabled: !!key,
  });

  return privateKey;
}

const usePrivateKeyJWK = (userId: string) => {
  return useQuery({
    queryKey: ["STAFF_GEN_QRCODE", userId],
    queryFn: async () => {
      const resp = await functions.createExecution(
        getPrivateKeyFunctionId,
        JSON.stringify({ userId }),
      );

      const key = JSON.parse(resp.responseBody) as JsonWebKey;

      console.log("key: ", key, typeof key);

      return key;
    },
    enabled: !!userId,
  });
};

export function useStaffQRCode(userId: string, perpetual: boolean) {
  const { data: privateKeyJWK } = usePrivateKeyJWK(userId);

  const privateKey = usePrivateKey(userId, privateKeyJWK);

  const { isLoading, error, data } = useQuery({
    queryKey: [QUERY_KEYS.NEW_QR_CODE, userId, perpetual],
    queryFn: async () => {
      console.log("privateKey", privateKey);
      console.log("userId", userId);
      if (!privateKey || !userId) return undefined;

      const data = [userId, perpetual ? -1 : Date.now()] as const;
      const signature = await signData(privateKey, data);

      const codeData = encodeStampToQRCode([...data, signature]);

      return {
        codeData,
      };
    },
    refetchInterval: 5 * 1000,
    staleTime: 1000 * 60,
    enabled: !!privateKey && !!userId,
  });

  return { isLoading, error, data, privateKey };
}
