import { bytesToBase64DataUrl, dataUrlToBytes } from "./base64";
import { crypto } from "./crypto";
import { StampTuple } from "./models/Stamp";

const signAlgorithm = {
  name: "ECDSA",
  hash: { name: "SHA-384" },
} as const;

const textEncoder = new TextEncoder();

export async function signData(
  signatureKey: CryptoKey,
  payload: readonly (string | number)[],
) {
  return bytesToBase64DataUrl(
    await crypto.subtle.sign(
      signAlgorithm,
      signatureKey,
      textEncoder.encode(payload.join(":")),
    ),
  );
}

export async function verifyData(
  verificationKey: CryptoKey,
  payload: StampTuple,
) {
  const [standistId, expiryTimestamp, signature] = payload;
  const signatureBuffer = await dataUrlToBytes(signature);
  return crypto.subtle.verify(
    signAlgorithm,
    verificationKey,
    // we have to convert the ArrayBuffer to a Uint8Array because of a bug in JSDOM (somehow)
    new Uint8Array(signatureBuffer),
    textEncoder.encode([standistId, expiryTimestamp].join(":")),
  );
}
