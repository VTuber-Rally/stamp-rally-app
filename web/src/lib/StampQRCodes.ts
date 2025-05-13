import { StampTuple } from "@vtuber-stamp-rally/shared-lib/models/Stamp.ts";

import { publicUrl } from "@/lib/consts.ts";

export function encodeStampToQRCode(stamp: StampTuple) {
  const stringifiedStamp = JSON.stringify(stamp);

  const url = new URL(publicUrl);
  url.pathname += (url.pathname.endsWith("/") ? "" : "/") + "code/s";
  url.hash = encodeURIComponent(stringifiedStamp);
  return url.toString();
}

export function encodeContestSecretToQRCode(secret: string) {
  const url = new URL(publicUrl);
  url.pathname += (url.pathname.endsWith("/") ? "" : "/") + "code/c";
  url.hash = encodeURIComponent(secret);
  return url.toString();
}

export function retrieveInfosFromQRCode(qrData: string) {
  let url: URL;
  try {
    url = new URL(qrData);
  } catch (err) {
    throw new Error("Malformed QR code", { cause: err });
  }

  if (!url.pathname.includes("code")) throw new Error("No code in the URL");

  const path = url.pathname.split("/").pop();

  if (!url.hash || !path) throw new Error("Malformed QR code");
  return { type: path, hash: url.hash.slice(1) };
}
