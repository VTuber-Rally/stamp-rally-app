import { describe, expect, test } from "vitest";

import { StampTupleSerializer } from "@/lib/models/Stamp.ts";
import { signData, verifyData } from "@/lib/signatures.ts";

const keyAlgorithm = {
  name: "ECDSA",
  namedCurve: "P-384",
} as const;

const publicKey = {
  alg: "ES384",
  crv: "P-384",
  ext: true,
  key_ops: ["verify"],
  kty: "EC",
  x: "tII2e5umrofMOw2wbBxsezs--WDTNA1iIU_mQJsURAyIWXot66zwiWkf4SzYTJlD",
  y: "bZSZgaoBRlBFaGWN-qspM0k5Fk9L6IpAtj_nrMDZMpO76TkRd1Ssdk8GuvO42Jtx",
};

const privateKey = {
  alg: "ES384",
  crv: "P-384",
  d: "_HYfhei8thPCWbfQIuw3IJWvmIcGFSHXWjMdVEfP-co3wLKCH4EB8Rf9tRpMXqxA",
  ext: true,
  key_ops: ["sign"],
  kty: "EC",
  x: "tII2e5umrofMOw2wbBxsezs--WDTNA1iIU_mQJsURAyIWXot66zwiWkf4SzYTJlD",
  y: "bZSZgaoBRlBFaGWN-qspM0k5Fk9L6IpAtj_nrMDZMpO76TkRd1Ssdk8GuvO42Jtx",
};

describe("signatures", () => {
  test("should be able to sign and verify", async () => {
    const importedPrivateKey = await window.crypto.subtle.importKey(
      "jwk",
      privateKey,
      keyAlgorithm,
      true,
      ["sign"],
    );

    // sign data
    const payload = ["standistId", 1234];

    const data = await signData(importedPrivateKey, payload);

    // verify data
    const importedPublicKey = await window.crypto.subtle.importKey(
      "jwk",
      publicKey,
      keyAlgorithm,
      true,
      ["verify"],
    );

    const dataToVerify = [...payload, data];

    const serialized = StampTupleSerializer.safeParse(dataToVerify);
    if (!serialized.success)
      throw new TypeError("Stamp cannot be deserialized");

    const verified = await verifyData(importedPublicKey, serialized.data);

    expect(verified).toBe(true);
  });

  test("should not tampered payload", async () => {
    const importedPrivateKey = await window.crypto.subtle.importKey(
      "jwk",
      privateKey,
      keyAlgorithm,
      true,
      ["sign"],
    );

    // sign data
    const payload = ["standistId", 1234];
    const tamperedPayload = ["standistId", 12345];

    const data = await signData(importedPrivateKey, payload);

    // verify data
    const importedPublicKey = await window.crypto.subtle.importKey(
      "jwk",
      publicKey,
      keyAlgorithm,
      true,
      ["verify"],
    );

    const dataToVerify = [...tamperedPayload, data];

    const serialized = StampTupleSerializer.safeParse(dataToVerify);
    if (!serialized.success)
      throw new TypeError("Stamp cannot be deserialized");

    const verified = await verifyData(importedPublicKey, serialized.data);

    expect(verified).toBe(false);
  });
});
