import { z } from "zod";

export const RegisterContestParticipantFunctionRequestValidator = z.object({
  secret: z.string(),
});

export type RegisterContestParticipantFunctionRequest = z.infer<
  typeof RegisterContestParticipantFunctionRequestValidator
>;

export type RegisterContestParticipantFunctionResponse =
  | {
      status: "success";
      contestParticipantId: string;
    }
  | {
      status: "error";
      message: string;
      error: string;
    };
