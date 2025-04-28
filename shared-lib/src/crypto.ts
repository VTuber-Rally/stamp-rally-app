export const crypto =
  typeof window !== "undefined" ? window.crypto : globalThis.crypto;

export const importJWK = (jwk: JsonWebKey) =>
  crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "ECDSA",
      namedCurve: "P-384",
    },
    true,
    ["verify"],
  );
