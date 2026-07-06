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
  const signatureKey = await importJWK(signatureJsonKey, true);
  return new Uint8Array(
    await window.crypto.subtle.sign(
      signAlgorithm,
      signatureKey,
      textEncoder.encode(payload.join(":")),
    ),
  ).toBase64({ alphabet: "base64url" });
}

export async function verifyData(
  verificationJsonKey: JsonWebKey,
  payload: StampTuple,
) {
  const [standistId, expiryTimestamp, signature] = payload;
  const signatureBuffer = Uint8Array.fromBase64(signature, {
    alphabet: "base64url",
  });
  const verificationKey = await importJWK(verificationJsonKey);
  return window.crypto.subtle.verify(
    signAlgorithm,
    verificationKey,
    // we have to convert the ArrayBuffer to a Uint8Array because of a bug in JSDOM (somehow)
    signatureBuffer,
    textEncoder.encode([standistId, expiryTimestamp].join(":")),
  );
}
