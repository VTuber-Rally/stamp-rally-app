import { Models } from "appwrite";

export interface ContestParticipant extends Models.Document {
  name: string;
  email: string;
  registeredAt: string;
}
