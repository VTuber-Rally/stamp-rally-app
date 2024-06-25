import { StampTuple } from "@/lib/models/Stamp.ts";

export function encodeStampToQRCode(stamp: StampTuple) {
  const stringifiedStamp = JSON.stringify(stamp);

  const url = new URL(import.meta.env.VITE_PUBLIC_URL);
  url.pathname += url.pathname.endsWith("/") ? "code" : "/code";
  url.hash = encodeURIComponent(stringifiedStamp);
  return url.toString();
}

export function retrieveHashFromQRCode(qrData: string) {
  let url: URL;
  try {
    url = new URL(qrData);
  } catch (err) {
    throw new Error("Malformed QR code", { cause: err });
  }

  if (!url.hash) throw new Error("Malformed QR code");
  return url.hash.slice(1);
}
