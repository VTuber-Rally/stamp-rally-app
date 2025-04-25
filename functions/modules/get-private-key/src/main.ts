import { Client, Databases, ID, Query, Users } from 'node-appwrite';

type Context = {
  req: {
    body: string;
    bodyRaw: string;
    headers: { [key: string]: string };
    scheme: string;
    method: string;
    url: string;
    host: string;
    port: string;
    path: string;
    queryString: string;
    query: { [key: string]: string };
  };
  res: {
    send: (body: string, code?: number, headers?: any[]) => void;
    json: (body: any) => void;
    empty: () => void;
    redirect: (url: string, code: number) => void;
  };
  log: (message: any) => void;
  error: (message: any) => void;
};

export default async ({ req, res, log, error }: Context) => {
  const client = new Client()
    .setEndpoint(process.env['APPWRITE_FUNCTION_API_ENDPOINT'])
    .setProject(process.env['APPWRITE_FUNCTION_PROJECT_ID'])
    .setKey(req.headers['x-appwrite-key']);

  const users = new Users(client);

  const { userId } = JSON.parse(req.body);

  const user = await users.get(userId);

  if (!user) {
    return res.json({ error: 'User not found' });
  }

  // return user's privateKey
  return res.json(JSON.parse(user.prefs.privateKey));
};
