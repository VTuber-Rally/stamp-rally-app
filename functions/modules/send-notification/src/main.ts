import { Client, Messaging, ID } from 'node-appwrite';
import type { Context, SendNotificationResponse } from 'shared-lib';

export default async ({
  req,
  res,
  log,
  error,
}: Context<SendNotificationResponse>) => {
  const client = new Client()
    .setEndpoint(process.env['APPWRITE_FUNCTION_API_ENDPOINT'])
    .setProject(process.env['APPWRITE_FUNCTION_PROJECT_ID'])
    .setKey(req.headers['x-appwrite-key']);

  const messaging = new Messaging(client);

  const { title, text, topic } = JSON.parse(req.body);

  log(`Sending push notification to ${topic}: ${title} - ${text}`);
  try {
    await messaging.createPush(ID.unique(), title, text, [topic]);
    return res.json({
      status: 'success',
    });
  } catch (err) {
    error(err);
    return res.json({
      status: 'error',
    });
  }
};
