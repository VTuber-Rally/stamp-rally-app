import { z } from "zod";

export const StampTupleSerializer = z.tuple([
  z.string(), // Standist ID
  z.number(), // Stamp Timestamp (pun intended?)
  z.string().startsWith("data:"), // Signature
]);
export type StampTuple = z.infer<typeof StampTupleSerializer>;

export const StampModelValidator = z.object({
  standistId: z.string(),
  timestamp: z.number(),
  scanTimestamp: z.number(),
  signature: z.string(),
  submitted: z.boolean(),
});
export type Stamp = z.infer<typeof StampModelValidator>;

export interface StampWithId extends Stamp {
  id: number;
}

export const stampIndexes = "++id, standistId, submitted, timestamp";
