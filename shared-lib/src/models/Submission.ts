import { Stamp } from "./Stamp";

export interface Submission {
  submissionId: string; // comes from the server when submitted, unique
  submitted: Date; // date of submission
  redeemed: boolean; // whether the submission has been redeemed, from Appwrite
  stamps: Stamp[]; // stamps contained in the submission
}

export interface SubmissionWithId extends Submission {
  id: number; // local id
}

export const submissionIndexes = "++id, &submissionId, submitted, stamps";
