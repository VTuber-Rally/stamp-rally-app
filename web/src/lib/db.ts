import {
  ContestParticipation,
  contestParticipationIndexes,
} from "@vtuber-stamp-rally/shared-lib/models/ContestParticipation.ts";
import {
  StampWithId,
  stampIndexes,
} from "@vtuber-stamp-rally/shared-lib/models/Stamp.ts";
import {
  Standist,
  standistIndexes,
} from "@vtuber-stamp-rally/shared-lib/models/Standist.ts";
import {
  SubmissionWithId,
  submissionIndexes,
} from "@vtuber-stamp-rally/shared-lib/models/Submission.ts";
import Dexie, { type EntityTable } from "dexie";

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
