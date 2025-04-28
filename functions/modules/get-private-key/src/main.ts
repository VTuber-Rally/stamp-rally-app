import { Client, Users } from 'node-appwrite';
import type { Context, GetPrivateKeyFunctionResponse } from 'shared-lib';

export default async ({
  req,
  res,
  log,
  error,
}: Context<GetPrivateKeyFunctionResponse>) => {
  const client = new Client()
    .setEndpoint(process.env['APPWRITE_FUNCTION_API_ENDPOINT'])
    .setProject(process.env['APPWRITE_FUNCTION_PROJECT_ID'])
    .setKey(req.headers['x-appwrite-key']);

  const users = new Users(client);

  const { userId } = JSON.parse(req.body);

  try {
    const user = await users.get(userId);

    if (!user) {
      return res.json({ status: 'error', message: 'User not found' });
    }

    return res.json({
      status: 'success',
      privateKey: JSON.parse(user.prefs.privateKey),
    });
  } catch (e) {
    return res.json({
      status: 'error',
      message: `Failed to get private key: ${e}`,
    });
  }
};
