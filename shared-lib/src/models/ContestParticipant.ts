import { Models } from "appwrite";

export interface ContestParticipant extends Models.Document {
  userId: string;
  name: string;
  registeredAt: string;
  isWinner?: boolean;
  drawnDate?: string;
}
