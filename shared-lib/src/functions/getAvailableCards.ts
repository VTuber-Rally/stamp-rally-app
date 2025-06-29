import { z } from "zod";

import { CardAvailable, Group } from "../models/Inventory";

export const GetAvailableCardsFunctionRequestValidator = z.object({});

export type GetAvailableCardsFunctionRequest = z.infer<
  typeof GetAvailableCardsFunctionRequestValidator
>;

export type GetAvailableCardsFunctionResponse =
  | {
      status: "success";
      group: Group;
      cards: CardAvailable[];
    }
  | {
      status: "error";
      message: string;
      error: string;
    };
