import { skipToken, useQuery } from "@tanstack/react-query";

import { signData } from "@vtube-stamp-rally/shared-lib/signatures.ts";

import { encodeStampToQRCode } from "@/lib/StampQRCodes.ts";
import { functions } from "@/lib/appwrite.ts";
import { getPrivateKeyFunctionId } from "@/lib/consts.ts";

import { QUERY_KEYS } from "../QueryKeys.ts";

function usePrivateKey(userId: string, key?: JsonWebKey) {
  const { data: privateKey } = useQuery({
    queryKey: [QUERY_KEYS.PRIVATE_KEY, userId],
    queryFn: key
      ? async () => {
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

          return keyImported;
        }
      : skipToken,
  });

  return privateKey;
}

// TODO: refactor with ev
type FunctionReturnType =
  | {
      status: "success";
      privateKey: JsonWebKey;
    }
  | {
      status: "error";
      message: string;
    };

const usePrivateKeyJWK = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.STAFF_GEN_QRCODE, userId],
    queryFn: async () => {
      const resp = await functions.createExecution(
        getPrivateKeyFunctionId,
        JSON.stringify({ userId }),
      );

      const respJson = JSON.parse(resp.responseBody) as FunctionReturnType;

      if (respJson.status !== "success") {
        throw new Error(respJson.message);
      }

      return respJson.privateKey;
    },
  });
};

const generateQRCode = async (
  userId: string,
  privateKey: CryptoKey,
  perpetual: boolean,
) => {
  const data = [userId, perpetual ? -1 : Date.now()] as const;
  const signature = await signData(privateKey, data);

  const codeData = encodeStampToQRCode([...data, signature]);

  return {
    codeData,
  };
};

export function useStaffQRCode(userId: string, perpetual: boolean) {
  const { data: privateKeyJWK } = usePrivateKeyJWK(userId);

  const privateKey = usePrivateKey(userId, privateKeyJWK);

  const { isLoading, error, data } = useQuery({
    queryKey: [QUERY_KEYS.NEW_QR_CODE, userId, perpetual],
    queryFn: privateKey
      ? () => generateQRCode(userId, privateKey, perpetual)
      : skipToken,
    refetchInterval: 5 * 1000,
    staleTime: 1000 * 60,
  });

  return { isLoading, error, data };
}
