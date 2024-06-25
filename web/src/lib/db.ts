import Dexie, { type EntityTable } from "dexie";
import { stampIndexes, StampWithId } from "@/lib/models/Stamp.ts";
import { Standist, standistIndexes } from "@/lib/models/Standist.ts";
import {
  submissionIndexes,
  SubmissionWithId,
} from "@/lib/models/Submission.ts";

export const db = new Dexie("StampRally") as Dexie & {
  stamps: EntityTable<StampWithId, "id">;
  standists: EntityTable<Standist, "userId">;
  submissions: EntityTable<SubmissionWithId, "id">;
};

db.version(2).stores({
  stamps: stampIndexes,
  standists: standistIndexes,
  submissions: submissionIndexes,
});
