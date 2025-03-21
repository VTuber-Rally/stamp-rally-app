import Dexie, { type EntityTable } from "dexie";

import {
  ContestParticipation,
  contestParticipationIndexes,
} from "@/lib/models/ContestParticipation.ts";
import { StampWithId, stampIndexes } from "@/lib/models/Stamp.ts";
import { Standist, standistIndexes } from "@/lib/models/Standist.ts";
import {
  SubmissionWithId,
  submissionIndexes,
} from "@/lib/models/Submission.ts";

export const db = new Dexie("StampRally") as Dexie & {
  stamps: EntityTable<StampWithId, "id">;
  standists: EntityTable<Standist, "userId">;
  submissions: EntityTable<SubmissionWithId, "id">;
  contestParticipations: EntityTable<ContestParticipation, "id">;
};

db.version(3).stores({
  stamps: stampIndexes,
  standists: standistIndexes,
  submissions: submissionIndexes,
  contestParticipations: contestParticipationIndexes,
});
