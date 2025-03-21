import { Client, Databases, ID, Role, Query, Permission } from 'node-appwrite';
import { dataUrlToBytes } from './base64.js';

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

interface Stamp {
  standistId: string;
  timestamp: number;
  scanTimestamp: number;
  signature: string;
  id: number;
}

const SUBMISSION_DATABASE_ID = process.env['DATABASE_ID'];
const SUBMISSION_COLLECTION_ID = process.env['SUBMISSIONS_COLLECTION_ID'];
const PROFILE_COLLECTION_ID = process.env['STANDISTS_COLLECTION_ID'];

const signAlgorithm = {
  name: 'ECDSA',
  hash: { name: 'SHA-384' },
} as const;

const textEncoder = new TextEncoder();

type Standist = {
  // to link with the generated qr codes
  userId: string;
  publicKey: CryptoKey;

  name: string;
  hall: string;
  boothNumber: string;
  description: string;

  image: string;

  twitter?: string;
  instagram?: string;
  twitch?: string;
};

function importJWK(jwk: JsonWebKey) {
  return crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDSA', namedCurve: 'P-384' },
    true,
    ['verify']
  );
}

export default async ({ req, res, log, error }: Context) => {
  const client = new Client()
    .setEndpoint(process.env['APPWRITE_FUNCTION_API_ENDPOINT'])
    .setProject(process.env['APPWRITE_FUNCTION_PROJECT_ID'])
    .setKey(req.headers['x-appwrite-key']);

  const userId = req.headers['x-appwrite-user-id'];

  const database = new Databases(client);

  const { documents: standists } = await database.listDocuments(
    SUBMISSION_DATABASE_ID,
    PROFILE_COLLECTION_ID
  );

  console.time('Signatures import');
  const standistsList: Standist[] = await Promise.all(
    standists.map(async (document) => {
      const {
        userId,
        publicKey,
        name,
        hall,
        boothNumber,
        description,
        image,
        twitter,
        instagram,
        twitch,
      } = document;
      return {
        userId,
        publicKey: await importJWK(JSON.parse(publicKey)),
        name,
        hall,
        boothNumber,
        description,
        image,
        twitter,
        instagram,
        twitch,
      };
    })
  );
  console.timeEnd('Signatures import');

  log(JSON.stringify(req.body, null, 2));

  const { stamps } = JSON.parse(req.body) as { stamps: Stamp[] };

  log(stamps);

  // first, let's check that every signature are valid
  for (const stamp of stamps) {
    const standist = standistsList.find(
      (standist) => standist.userId === stamp.standistId
    );

    if (!standist) {
      throw new Error('Standist not found.');
    }

    const signature = await dataUrlToBytes(stamp.signature);

    log(`Verifying signature for ${stamp.standistId} - ${standist.name}.`);

    const dataToBeEncoded = [stamp.standistId, stamp.timestamp].join(':');

    log('data: ' + dataToBeEncoded);

    let publicKey = await crypto.subtle.exportKey('jwk', standist.publicKey);
    log(JSON.stringify(publicKey));

    const isValid = await crypto.subtle.verify(
      signAlgorithm,
      standist.publicKey,
      signature,
      textEncoder.encode(dataToBeEncoded)
    );

    if (!isValid) {
      throw new Error('Invalid signature.');
    }

    log(`Signature is valid for ${stamp.standistId} - ${standist.name}.`);
  }

  // [{"standistId":"66873ba1003580d5cfa5","timestamp":1720138952022,"signature":"data:application/octet-stream;base64,IHZgknnGlzgf78i3W+APBzkAW1pGQt6xgl0G2KsLIbaIQTGuXklJ6hfLbmF/iehlqoJpVm3E78AKCT9W1cfH4cIDnUFQhbMlGIEC7z3Q9wgdS8P79UUJ0eayy6lIlave","scanTimestamp":1720138956024,"id":1},{"standistId":"66873ba100357fcd48f0","timestamp":1720140819422,"signature":"data:application/octet-stream;base64,IFnJe+B6o3iUDiTga5UUdX20IVGw/d8r5Ktp1YXVN/9kZ32xAjMj7B89pqROkN2yNWbFRYjd2F1jL29DWjrdBkL2vlnbQqaRItJJIDqi15wTja+p2+etmhjhxdWMB1hI","scanTimestamp":1720140821377,"id":2}]

  const stampPromises = stamps.map(async (stamp) => {
    // get standist's document id from its userid
    const { documents } = await database.listDocuments(
      SUBMISSION_DATABASE_ID,
      PROFILE_COLLECTION_ID,
      [Query.equal('userId', stamp.standistId)]
    );

    if (documents.length === 0 || documents.length > 1) {
      throw new Error('Standist not found or multiple found.');
    }

    const standist = documents[0];

    return {
      standist: standist.$id,
      generated: new Date(stamp.timestamp).toISOString(),
      signature: stamp.signature,
      scanned: new Date(stamp.scanTimestamp).toISOString(),
      $permissions: [Permission.read(Role.user(userId))],
    };
  });

  const stampsResolved = await Promise.all(stampPromises);

  const data = {
    redeemed: false,
    submitted: new Date().toISOString(),
    userId,
    stamps: stampsResolved,
  };

  const submissionId = ID.unique();

  await database.createDocument(
    SUBMISSION_DATABASE_ID,
    SUBMISSION_COLLECTION_ID,
    submissionId,
    data,
    [Permission.read(Role.user(userId))]
  );

  return res.json({ submissionId });
};
