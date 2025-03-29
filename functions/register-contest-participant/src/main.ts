import {
  Client,
  Databases,
  ID,
  Permission,
  Query,
  Role,
  Users,
} from 'node-appwrite';

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

const DATABASE_ID = process.env['DATABASE_ID'] ?? '6675f377000709b0db07';
const SUBMISSION_COLLECTION_ID =
  process.env['SUBMISSION_COLLECTION_ID'] ?? '6687300000095507a828';
const CONTEST_COLLECTION_ID =
  process.env['CONTEST_COLLECTION_ID'] ?? '67d0429b003758d966ce';
const KV_COLLECTION_ID =
  process.env['KV_COLLECTION_ID'] ?? '67d54ef600021e18818a';

export default async ({ req, res, log, error }: Context) => {
  const client = new Client()
    .setEndpoint(process.env['APPWRITE_FUNCTION_API_ENDPOINT']!)
    .setProject(process.env['APPWRITE_FUNCTION_PROJECT_ID']!)
    .setKey(req.headers['x-appwrite-key']!);

  const users = new Users(client);

  log('got req' + JSON.stringify(req.body, null, 2));

  const db = new Databases(client);

  const kvDocument = await db.listDocuments(DATABASE_ID, KV_COLLECTION_ID, [
    Query.or([
      Query.equal('key', 'contestRegistrationSecret'),
      Query.equal('key', 'isContestOpenToRegistration'),
    ]),
  ]);

  if (kvDocument.documents.length === 0) {
    return res.json({
      status: 'error',
      message: 'contest.registration.serverError',
      error: 'Secret/isContestOpenToRegistration not found',
    });
  }

  const secret = kvDocument.documents.find(
    (doc) => doc.key === 'contestRegistrationSecret'
  )?.value;
  const isContestOpenToRegistration = JSON.parse(
    kvDocument.documents.find(
      (doc) => doc.key === 'isContestOpenToRegistration'
    )?.value ?? 'false'
  );

  if (!isContestOpenToRegistration) {
    return res.json({
      status: 'error',
      message: 'contest.registration.notOpen',
      error: 'Contest is not open to registration',
    });
  }

  const { secret: secretFromUser } = JSON.parse(req.body) as { secret: string };

  const userId = req.headers['x-appwrite-user-id'];

  const user = await users.get(userId);
  log('user' + JSON.stringify(user, null, 2));

  if (secretFromUser !== secret) {
    log(`Expected secret: ${secret}, got: ${secretFromUser}`);
    return res.json({
      status: 'error',
      message: 'contest.registration.invalidSecret',
      error: 'Invalid secret',
    });
  }

  const submissions = await db.listDocuments(
    DATABASE_ID,
    SUBMISSION_COLLECTION_ID,
    [Query.equal('userId', userId)]
  );

  log(JSON.stringify(submissions, null, 2));

  if (submissions.documents.length === 0) {
    return res.json({
      status: 'error',
      message: 'contest.registration.noSubmissions',
      error: 'User has no submissions',
    });
  }

  // check if the user has already registered
  const contestParticipant = await db.listDocuments(
    DATABASE_ID,
    CONTEST_COLLECTION_ID,
    [Query.equal('userId', userId), Query.isNull('drawnDate')]
  );

  if (contestParticipant.documents.length > 0) {
    return res.json({
      status: 'error',
      message: 'contest.registration.alreadyRegistered',
      error: 'User has already registered',
    });
  }

  // create a contest participant
  const created = await db.createDocument(
    DATABASE_ID,
    CONTEST_COLLECTION_ID,
    ID.unique(),
    {
      userId: userId,
      name: user.name ?? user.email,
      registeredAt: new Date().toISOString(),
    },
    [Permission.read(Role.user(userId))]
  );

  log(created);

  return res.json({
    status: 'success',
    message: 'contest.registration.success',
    contestParticipantId: created.$id,
  });
};
