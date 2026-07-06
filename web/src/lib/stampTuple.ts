import { z } from "zod";

export const StampTupleSerializer = z.tuple([
  z.string(), // Standist ID
  z.number(), // Stamp Expiry Timestamp (pun intended?)
  z.string().base64url(), // Signature
]);
export type StampTuple = z.infer<typeof StampTupleSerializer>;
