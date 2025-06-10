import Dexie, { type EntityTable } from "dexie";

import {
  ContestParticipation,
  contestParticipationIndexes,
} from "@vtube-stamp-rally/shared-lib/models/ContestParticipation.ts";
import {
  StampWithId,
  stampIndexes,
} from "@vtube-stamp-rally/shared-lib/models/Stamp.ts";
import {
  Standist,
  standistIndexes,
} from "@vtube-stamp-rally/shared-lib/models/Standist.ts";
import {
  SubmissionWithId,
  submissionIndexes,
} from "@vtube-stamp-rally/shared-lib/models/Submission.ts";

import { indexedDbName } from "./consts";

export const db = new Dexie(indexedDbName) as Dexie & {
  stamps: EntityTable<StampWithId, "id">;
  standists: EntityTable<Standist, "userId">;
  submissions: EntityTable<SubmissionWithId, "id">;
  contestParticipations: EntityTable<ContestParticipation, "id">;
};

db.version(5).stores({
  stamps: stampIndexes,
  standists: standistIndexes,
  submissions: submissionIndexes,
  contestParticipations: contestParticipationIndexes,
});
