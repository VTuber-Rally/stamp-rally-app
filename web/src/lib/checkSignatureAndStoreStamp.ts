import { StampTuple } from "@vtube-stamp-rally/shared-lib/models/Stamp.ts";
import { verifyData } from "@vtube-stamp-rally/shared-lib/signatures.ts";

import { QUERY_KEYS } from "@/lib/QueryKeys.ts";
import { jwkAlgorithm } from "@/lib/consts.ts";
import { IntegrityError } from "@/lib/errors.ts";
import { getBooths } from "@/lib/hooks/useBooths.ts";
import { queryClient } from "@/lib/queryClient.ts";
import { Stamp, useStampStore } from "@/lib/stampStore.ts";

function invalidateStamps() {
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.STAMPS],
  });
}

export async function checkSignatureAndStoreStamp(stamp: StampTuple) {
  const [boothId, expiryTimestamp, signature] = stamp;

  const booth = (await getBooths()).find((booth) => booth._id === boothId);

  if (!booth) throw new Error("Standist not found");

  const publicKey = await window.crypto.subtle.importKey(
    "jwk",
    booth.publicKey,
    jwkAlgorithm,
    false,
    ["verify"],
  );

  const isSignatureValid = await verifyData(publicKey, stamp);
  if (!isSignatureValid) throw new IntegrityError("Signature is not valid");

  const stampRecord = {
    boothId,
    expiryTimestamp,
    signature,
    submitted: false,
    scanTimestamp: Date.now(),
  } satisfies Stamp;

  const alreadyExistingStampRecord = useStampStore
    .getState()
    .stamps.find(
      (stampRecord) =>
        stampRecord.boothId === boothId && !stampRecord.submitted,
    );

  if (
    alreadyExistingStampRecord &&
    alreadyExistingStampRecord.expiryTimestamp === stampRecord.expiryTimestamp
  ) {
    return { ...stampRecord, updated: true };
  }

  // si timestamp de -1, alors on saute la vérification de l'âge
  if (stampRecord.expiryTimestamp !== -1) {
    if (stampRecord.scanTimestamp >= stampRecord.expiryTimestamp) {
      throw new IntegrityError("The QR code is too old");
    }
  }

  useStampStore.getState().upsertStamp(stampRecord);
  window.plausible("Stamp Scanned", {
    props: {
      stand: booth.name,
    },
  });

  return { ...stampRecord, updated: !!alreadyExistingStampRecord };
}
