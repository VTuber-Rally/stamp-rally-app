import type{ Polygon } from "geojson";

export interface Standist {
  // to link with the generated qr codes
  userId: string;
  publicKey: CryptoKey;

  name: string;
  hall: string;
  boothNumber: string;
  description: string;

  image: string;

  twitter?: string;
  instagram?: string;
  twitch?: string;

  geometry?: Polygon["coordinates"];
}

export const standistIndexes =
  "&userId, name, hall, boothNumber, description, image, twitter, instagram, twitch";
