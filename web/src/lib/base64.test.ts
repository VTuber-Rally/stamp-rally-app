// test bytesToBase64DataUrl
import { describe, expect, test } from "vitest";

import { bytesToBase64DataUrl, dataUrlToBytes } from "./base64";

const ExpectedByteArray = "data:application/octet-stream;base64,AQIDBA==";
const ExpectedBase64Array = new Uint8Array([1, 2, 3, 4]);

describe("bytesToBase64DataUrl", () => {
  test("should convert an ArrayBuffer to a base64 data URL", async () => {
    const bytes = new Uint8Array([1, 2, 3, 4]).buffer;
    const dataUrl = await bytesToBase64DataUrl(bytes);
    expect(dataUrl).equal(ExpectedByteArray);
  });
});

describe("dataUrlToBytes", () => {
  test("should convert a base64 data URL to an ArrayBuffer", async () => {
    const bytes = await dataUrlToBytes(ExpectedByteArray);

    for (let i = 0; i < ExpectedBase64Array.length; i++) {
      expect(new Uint8Array(bytes)[i]).toBe(ExpectedBase64Array[i]);
    }
  });

  test("should throw an error if the data URL is malformed", async () => {
    const malformedDataUrl = "data:application/octet-stream;base";
    await expect(dataUrlToBytes(malformedDataUrl)).rejects.toThrow(
      "fetch failed",
    );
  });
});
