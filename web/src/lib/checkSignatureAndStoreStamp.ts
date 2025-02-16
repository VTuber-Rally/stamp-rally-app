import { QUERY_KEYS } from "@/lib/QueryKeys.ts";
import { db } from "@/lib/db.ts";
import { IntegrityError } from "@/lib/errors.ts";
import { getStandists } from "@/lib/hooks/useStandists.ts";
import { Stamp, StampTuple } from "@/lib/models/Stamp.ts";
import { queryClient } from "@/lib/queryClient.ts";
import { verifyData } from "@/lib/signatures.ts";

function invalidateStamps() {
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.STAMPS],
  });
}

export async function checkSignatureAndStoreStamp(stamp: StampTuple) {
  const [standistId, timestamp, signature] = stamp;

  const standist = (await getStandists()).find(
    (standist) => standist.userId === standistId,
  );

  if (!standist) throw new Error("Standist not found");

  const isSignatureValid = await verifyData(standist.publicKey, stamp);
  if (!isSignatureValid) throw new IntegrityError("Signature is not valid");

  const stampRecord = {
    standistId,
    timestamp,
    signature,
    submitted: false,
    scanTimestamp: Date.now(),
  } satisfies Stamp;

  const alreadyExistingStampRecord = await db.stamps
    .where({ standistId })
    .filter((stamp) => !stamp.submitted)
    .first();

  if (
    alreadyExistingStampRecord &&
    alreadyExistingStampRecord.timestamp === stampRecord.timestamp
  ) {
    return { ...stampRecord, updated: true };
  }

  // si timestamp de -1, alors on saute la vérification de l'âge
  if (stampRecord.timestamp !== -1) {
    if (stampRecord.scanTimestamp - stampRecord.timestamp > 2 * 60 * 1000) {
      throw new IntegrityError("The QR code is too old");
    }
  }

  if (alreadyExistingStampRecord) {
    await db.stamps.update(alreadyExistingStampRecord.id, stampRecord);
  } else {
    await db.stamps.add(stampRecord);
  }
  invalidateStamps();
  window.plausible("Stamp Scanned", {
    props: {
      stand: standist.name,
    },
  });

  return { ...stampRecord, updated: !!alreadyExistingStampRecord };
}
