import { z } from "zod";

export const StampTupleSerializer = z.tuple([
  z.string(), // Standist ID
  z.number(), // Stamp Timestamp (pun intended?)
  z.string().startsWith("data:"), // Signature
]);
export type StampTuple = z.infer<typeof StampTupleSerializer>;

export interface Stamp {
  standistId: string;
  timestamp: number;
  scanTimestamp: number;
  signature: string;
  submitted: boolean;
}

export interface StampWithId extends Stamp {
  id: number;
}

export const stampIndexes = "++id, standistId, submitted, timestamp";
