import { z } from "zod";

export const SendNotificationFunctionRequestValidator = z.object({
  title: z.string(),
  text: z.string(),
  topic: z.string(),
});

export type SendNotificationFunctionRequest = z.infer<
  typeof SendNotificationFunctionRequestValidator
>;

export type SendNotificationFunctionResponse = {
  status: "success" | "error";
};
