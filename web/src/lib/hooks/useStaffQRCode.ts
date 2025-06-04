import { skipToken, useQuery } from "@tanstack/react-query";

import {
  GetPrivateKeyFunctionRequest,
  GetPrivateKeyFunctionResponse,
} from "@vtube-stamp-rally/shared-lib/functions/getPrivateKey.ts";
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

const usePrivateKeyJWK = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.STAFF_GEN_QRCODE, userId],
    queryFn: async () => {
      const resp = await functions.createExecution(
        getPrivateKeyFunctionId,
        JSON.stringify({ userId } satisfies GetPrivateKeyFunctionRequest),
      );

      const respJson = JSON.parse(
        resp.responseBody,
      ) as GetPrivateKeyFunctionResponse;

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
  expiryDate: number | undefined = Date.now() + 2 * 60 * 1000, // 2 minutes comme avant
) => {
  const expiryTimestamp = perpetual ? -1 : expiryDate;

  const data = [userId, expiryTimestamp] as const;
  const signature = await signData(privateKey, data);

  const codeData = encodeStampToQRCode([...data, signature]);

  return {
    codeData,
  };
};

export function useStaffQRCode(
  userId: string,
  perpetual: boolean,
  expiryDate: Date | null,
) {
  const { data: privateKeyJWK } = usePrivateKeyJWK(userId);

  const privateKey = usePrivateKey(userId, privateKeyJWK);

  const { isLoading, error, data } = useQuery({
    queryKey: [QUERY_KEYS.NEW_QR_CODE, userId, perpetual, expiryDate],
    queryFn: privateKey
      ? () =>
          generateQRCode(userId, privateKey, perpetual, expiryDate?.getTime())
      : skipToken,
    refetchInterval: 5 * 1000,
    staleTime: 1000 * 60,
  });

  return { isLoading, error, data };
}
