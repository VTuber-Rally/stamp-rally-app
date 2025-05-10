import { z } from "zod";

export const GetPrivateKeyFunctionRequestValidator = z.object({
  userId: z.string(),
});

export type GetPrivateKeyFunctionRequest = z.infer<
  typeof GetPrivateKeyFunctionRequestValidator
>;

export type GetPrivateKeyFunctionResponse =
  | {
      status: "success";
      privateKey: JsonWebKey;
    }
  | {
      status: "error";
      message: string;
    };
