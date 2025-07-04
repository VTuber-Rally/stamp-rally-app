import * as Sentry from "@sentry/react";

import { type Standist } from "@vtube-stamp-rally/shared-lib/models/Standist.ts";

import fallback from "@/assets/fallback-avatar.png";

import { storage } from "./appwrite";
import { assetsBucketId } from "./consts";
import { getStandists } from "./hooks/useStandists";

export const getArtistImage = async (standistId: string) => {
  try {
    const standists = await getStandists();
    const standist = standists.find(
      (standist: Standist) => standist.userId === standistId,
    );
    if (!standist?.image || standist?.image == "fallback")
      throw new Error("No image found for standist " + standistId);
    return storage.getFileDownload(assetsBucketId, standist?.image);
  } catch (error) {
    console.error("Failed to load artist image:", error);
    // ça devrait jamais arriver hein... n'est-ce pas ?
    Sentry.captureException(error); // au cas où
    return fallback;
  }
};

export const getCardDesignImagePreview = (
  cardDesignId: string,
  width: number,
  height: number,
) => {
  try {
    return storage.getFilePreview(assetsBucketId, cardDesignId, width, height);
  } catch (error) {
    console.error("Failed to load card design image:", error);
    Sentry.captureException(error);
    return null;
  }
};
