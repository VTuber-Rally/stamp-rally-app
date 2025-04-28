export interface ContestParticipation {
  id: string; // comes from the server when submitted, unique
  submittedAt: Date; // date of submission
  isWinner: boolean;
  drawnDate?: Date;
}

export const contestParticipationIndexes =
  "id, submittedAt, isWinner, drawnDate";
