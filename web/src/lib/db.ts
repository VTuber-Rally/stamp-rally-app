import Dexie, { type EntityTable } from "dexie";
import { ContestParticipation, contestParticipationIndexes } from "shared-lib";
import { StampWithId, stampIndexes } from "shared-lib";
import { Standist, standistIndexes } from "shared-lib";
import { SubmissionWithId, submissionIndexes } from "shared-lib";

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
