import { Client, ID, Messaging } from "node-appwrite";

import {
  SendNotificationFunctionRequestValidator,
  SendNotificationFunctionResponse,
} from "@vtube-stamp-rally/shared-lib/functions/sendNotification.ts";
import { Context } from "@vtube-stamp-rally/shared-lib/types.ts";

export default async ({
  req,
  res,
  log,
  error,
}: Context<SendNotificationFunctionResponse>) => {
  const client = new Client()
    .setEndpoint(process.env["APPWRITE_FUNCTION_API_ENDPOINT"]!)
    .setProject(process.env["APPWRITE_FUNCTION_PROJECT_ID"]!)
    .setKey(req.headers["x-appwrite-key"]);

  const messaging = new Messaging(client);

  const {
    success: isDataValid,
    data: inputData,
    error: parseError,
  } = SendNotificationFunctionRequestValidator.safeParse(JSON.parse(req.body));

  if (!isDataValid) {
    error(parseError);
    return res.send("", 400);
  }

  const { title, text, topic } = inputData;

  log(`Sending push notification to ${topic}: ${title} - ${text}`);

  try {
    await messaging.createPush(ID.unique(), title, text, [topic]);
    return res.json({
      status: "success",
    });
  } catch (err) {
    error(err);
    return res.json({
      status: "error",
    });
  }
};
