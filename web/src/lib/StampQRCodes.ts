import { publicUrl } from "@/lib/consts.ts";
import { StampTuple } from "@/lib/models/Stamp.ts";

export function encodeStampToQRCode(stamp: StampTuple) {
  const stringifiedStamp = JSON.stringify(stamp);

  const url = new URL(publicUrl);
  url.pathname += url.pathname.endsWith("/") ? "code" : "/code";
  url.hash = encodeURIComponent("0" + stringifiedStamp);
  return url.toString();
}

export function encodeContestSecretToQRCode(secret: string) {
  const url = new URL(publicUrl);
  url.pathname += url.pathname.endsWith("/") ? "code" : "/code";
  url.hash = encodeURIComponent("1" + secret);
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

export function parseQRCodeData(hash: string): {
  type: "stamp";
  data: StampTuple;
} | {
  type: "contest";
  data: string;
} {
  const decodedHash = decodeURIComponent(hash);
  const type = decodedHash[0];
  const data = decodedHash.slice(1);

  switch (type) {
    case "0":
      return { type: "stamp", data: JSON.parse(data) };
    case "1":
      return { type: "contest", data };
    default:
      throw new Error("Invalid QR code type");
  }
}
