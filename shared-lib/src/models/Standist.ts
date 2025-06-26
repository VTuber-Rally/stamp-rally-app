import type { Models } from "appwrite";
import type { Polygon } from "geojson";

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
  website?: string;

  geometry?: Polygon["coordinates"];
}

export interface StandistDocument
  extends Omit<Standist, "publicKey" | "geometry">,
    Models.Document {
  publicKey: string;
  geometry?: string;
}

export const standistIndexes =
  "&userId, name, hall, boothNumber, description, image, twitter, instagram, twitch, website";
