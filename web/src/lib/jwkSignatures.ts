import { bytesToBase64DataUrl, dataUrlToBytes } from "@/lib/base64.ts";
import { jwkAlgorithm, signAlgorithm } from "@/lib/consts.ts";
import { StampTuple } from "@/lib/stampTuple.ts";

const textEncoder = new TextEncoder();

export const importJWK = (jwk: JsonWebKey, sign = false) =>
  crypto.subtle.importKey(
    "jwk",
    jwk,
    jwkAlgorithm,
    false,
    sign ? ["sign"] : ["verify"],
  );

export async function signData(
  signatureJsonKey: JsonWebKey,
  payload: readonly (string | number)[],
) {
  const signatureKey = await importJWK(signatureJsonKey);
  return bytesToBase64DataUrl(
    await window.crypto.subtle.sign(
      signAlgorithm,
      signatureKey,
      textEncoder.encode(payload.join(":")),
    ),
  );
}

export async function verifyData(
  verificationJsonKey: JsonWebKey,
  payload: StampTuple,
) {
  const [standistId, expiryTimestamp, signature] = payload;
  const signatureBuffer = await dataUrlToBytes(signature);
  const verificationKey = await importJWK(verificationJsonKey);
  return window.crypto.subtle.verify(
    signAlgorithm,
    verificationKey,
    // we have to convert the ArrayBuffer to a Uint8Array because of a bug in JSDOM (somehow)
    new Uint8Array(signatureBuffer),
    textEncoder.encode([standistId, expiryTimestamp].join(":")),
  );
}
