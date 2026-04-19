import * as Sentry from "@sentry/react";

import { storage } from "./appwrite";
import { assetsBucketId } from "./consts";

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
