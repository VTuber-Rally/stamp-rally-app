import { z } from "zod";

import { StampModelValidator } from "../models";

export const SubmitRallyFunctionRequestValidator = z.object({
  stamps: StampModelValidator.array().nonempty(),
});

export type SubmitRallyFunctionRequest = z.infer<
  typeof SubmitRallyFunctionRequestValidator
>;

export type SubmitRallyFunctionResponse =
  | {
      status: "success";
      submissionId: string;
    }
  | {
      status: "error";
      message: string;
    };
