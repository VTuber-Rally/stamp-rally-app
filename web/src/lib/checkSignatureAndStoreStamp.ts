import { ConvexId } from "@/lib/convex.ts";
import { IntegrityError } from "@/lib/errors.ts";
import { getBooths } from "@/lib/hooks/useBooths.ts";
import { verifyData } from "@/lib/jwkSignatures.ts";
import { Stamp, useStampStore } from "@/lib/stampStore.ts";
import { StampTuple } from "@/lib/stampTuple.ts";

export async function checkSignatureAndStoreStamp(stamp: StampTuple) {
  const [boothId, expiryTimestamp, signature] = stamp;

  const booth = (await getBooths()).find((booth) => booth._id === boothId);

  if (!booth) throw new Error("Standist not found");

  const isSignatureValid = await verifyData(booth.publicKey, stamp);
  if (!isSignatureValid) throw new IntegrityError("Signature is not valid");

  const stampRecord = {
    boothId: boothId as ConvexId<"booths">,
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
