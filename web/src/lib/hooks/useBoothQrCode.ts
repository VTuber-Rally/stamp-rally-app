import { useEffect, useState } from "react";

import { encodeStampToQRCode } from "@/lib/StampQRCodes.ts";
import { ConvexId } from "@/lib/convex.ts";
import { useBoothWithPrivateKey } from "@/lib/hooks/useBoothWithPrivateKey.ts";
import { signData } from "@/lib/jwkSignatures.ts";

const getExpiryTimestamp = () => Date.now() + 2 * 60 * 1000; // 2 minutes comme avant

export const useBoothQrCode = (
  boothId?: ConvexId<"booths">,
  overrideExpiryTimestamp?: number,
) => {
  const booth = useBoothWithPrivateKey(boothId);
  const [stateExpiryTimestamp, setExpiryTimestamp] =
    useState(getExpiryTimestamp);
  const [isLoading, setIsLoading] = useState(true);
  const [qrCodeData, setQrCodeData] = useState("");
  const [error, setError] = useState<Error | null>(null);

  const expiryTimestamp = overrideExpiryTimestamp ?? stateExpiryTimestamp;

  useEffect(() => {
    if (!booth?._id) return;
    let ignore = false;
    const data = [booth._id, expiryTimestamp] as const;
    signData(booth.privateKey, data)
      .then(
        (signature) => {
          if (ignore) return;
          setQrCodeData(encodeStampToQRCode([...data, signature]));
        },
        (err: Error) => {
          if (ignore) return;
          console.error(err);
          setError(err);
        },
      )
      .finally(() => setIsLoading(false));

    return () => {
      ignore = true;
    };
  }, [expiryTimestamp, booth?.privateKey, booth?._id]);

  useEffect(() => {
    if (overrideExpiryTimestamp) return;

    const interval = setInterval(() => {
      setExpiryTimestamp(getExpiryTimestamp());
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [overrideExpiryTimestamp]);

  return { qrCodeData, isLoading, error };
};
