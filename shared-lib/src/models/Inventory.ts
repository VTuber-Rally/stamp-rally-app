import { Models } from "appwrite";

import { StandistDocument } from "./Standist";
import { Submission } from "./Submission";

export interface Card extends Models.Document {
  cardDesign: CardDesign;
  group: Group;
  type: "classic" | "holo";
  status: "available" | "sold";
  cardHistory: CardHistory[];
}

export interface CardDesign extends Models.Document {
  name: string;
  author: string;
  image: string;
  standist?: StandistDocument;
}

export interface Group extends Models.Document {
  groupId: number;
  start: Date;
  end: Date;
  numberOfCardsPerDesign: number;
  numberOfHoloCardsPerDesign: number;
  coefficient: number;
  redistributed?: boolean;
}

export interface CardHistory extends Models.Document {
  group: Group;
  timestamp: Date;
  type: "initial" | "sold" | "redistribution";
  submission?: Submission & Models.Document;
}

export interface CardAvailable extends CardDesign {
  classicStock: number;
  holoStock: number;
}
