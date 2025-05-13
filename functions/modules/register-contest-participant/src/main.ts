import {
  Client,
  Databases,
  ID,
  Models,
  Permission,
  Query,
  Role,
  Users,
} from "node-appwrite";
import type {
  Context,
  RegisterContestParticipantFunctionResponse,
} from "shared-lib";
import { RegisterContestParticipantFunctionRequestValidator } from "shared-lib/src/functions/registerContestParticipant";

// partial model
export interface Submission extends Models.Document {
  redeemed: boolean;
}

const DATABASE_ID = process.env["DATABASE_ID"];
const SUBMISSIONS_COLLECTION_ID = process.env["SUBMISSIONS_COLLECTION_ID"];
const CONTEST_PARTICIPANTS_COLLECTION_ID =
  process.env["CONTEST_PARTICIPANTS_COLLECTION_ID"];
const KV_COLLECTION_ID = process.env["KV_COLLECTION_ID"];

export default async ({
  req,
  res,
  log,
}: Context<RegisterContestParticipantFunctionResponse>) => {
  if (
    !DATABASE_ID ||
    !SUBMISSIONS_COLLECTION_ID ||
    !CONTEST_PARTICIPANTS_COLLECTION_ID ||
    !KV_COLLECTION_ID
  ) {
    const missingVars = [];
    if (!DATABASE_ID) missingVars.push("DATABASE_ID");
    if (!SUBMISSIONS_COLLECTION_ID)
      missingVars.push("SUBMISSIONS_COLLECTION_ID");
    if (!CONTEST_PARTICIPANTS_COLLECTION_ID)
      missingVars.push("CONTEST_PARTICIPANTS_COLLECTION_ID");
    if (!KV_COLLECTION_ID) missingVars.push("KV_COLLECTION_ID");

    log(`Missing environment variables: ${missingVars.join(", ")}`);
    log(
      `Available environment variables: ${Object.keys(process.env).join(", ")}`,
    );
    throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
  }

  const client = new Client()
    .setEndpoint(process.env["APPWRITE_FUNCTION_API_ENDPOINT"]!)
    .setProject(process.env["APPWRITE_FUNCTION_PROJECT_ID"]!)
    .setKey(req.headers["x-appwrite-key"]);

  const users = new Users(client);

  log("got req" + JSON.stringify(req.body, null, 2));

  const db = new Databases(client);

  const kvDocument = await db.listDocuments(DATABASE_ID, KV_COLLECTION_ID, [
    Query.or([
      Query.equal("key", "contestRegistrationSecret"),
      Query.equal("key", "isContestOpenToRegistration"),
    ]),
  ]);

  const secretDoc = kvDocument.documents.find(
    (doc) => doc.key === "contestRegistrationSecret",
  );
  const isOpenDoc = kvDocument.documents.find(
    (doc) => doc.key === "isContestOpenToRegistration",
  );

  if (!secretDoc || !isOpenDoc) {
    return res.json({
      status: "error",
      message: "contest.registration.serverError",
      error: `${!secretDoc ? "Secret" : ""}${!secretDoc && !isOpenDoc ? "/" : ""}${!isOpenDoc ? "isContestOpenToRegistration" : ""} not found`,
    });
  }

  const secret = secretDoc.value as string;
  const isContestOpenToRegistration = isOpenDoc.value === "true";

  if (!isContestOpenToRegistration) {
    return res.json({
      status: "error",
      message: "contest.registration.notOpen",
      error: "Contest is not open to registration",
    });
  }

  const { success: isInputValid, data } =
    RegisterContestParticipantFunctionRequestValidator.safeParse(
      JSON.parse(req.body),
    );

  if (!isInputValid) {
    return res.send("", 400);
  }

  const secretFromUser = data.secret;

  const userId = req.headers["x-appwrite-user-id"];

  const user = await users.get(userId);
  log("user" + JSON.stringify(user, null, 2));

  if (secretFromUser !== secret) {
    log(`Expected secret: ${secret}, got: ${secretFromUser}`);
    return res.json({
      status: "error",
      message: "contest.registration.invalidSecret",
      error: "Invalid secret",
    });
  }

  const numberOfValidatedSubmissions = await db
    .listDocuments<Submission>(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, [
      Query.equal("userId", userId),
    ])
    .then((e) => e.documents)
    .then((e) => e.filter((e) => e.redeemed).length);

  const previousParticipations = await db
    .listDocuments(DATABASE_ID, CONTEST_PARTICIPANTS_COLLECTION_ID, [
      Query.equal("userId", userId),
    ])
    .then((e) => e.documents.length);

  log(
    "Number of previously validated submissions: " +
      numberOfValidatedSubmissions.toString() +
      " and of previousParticipations: " +
      previousParticipations.toString(),
  );

  if (numberOfValidatedSubmissions === 0) {
    return res.json({
      status: "error",
      message: "contest.registration.noSubmissions",
      error: "User has no submissions",
    });
  }

  if (numberOfValidatedSubmissions <= previousParticipations) {
    return res.json({
      status: "error",
      message: "contest.registration.notEnoughSubmissions",
      error: `User has not enough submissions (${numberOfValidatedSubmissions}, needs ${previousParticipations + 1})`,
    });
  }

  // check if the user has already registered
  const contestParticipant = await db.listDocuments(
    DATABASE_ID,
    CONTEST_PARTICIPANTS_COLLECTION_ID,
    [Query.equal("userId", userId), Query.isNull("drawnDate")],
  );

  if (contestParticipant.documents.length > 0) {
    return res.json({
      status: "error",
      message: "contest.registration.alreadyRegistered",
      error: "User has already registered",
    });
  }

  // create a contest participant
  const created = await db.createDocument(
    DATABASE_ID,
    CONTEST_PARTICIPANTS_COLLECTION_ID,
    ID.unique(),
    {
      userId: userId,
      name: user.name ?? user.email,
      registeredAt: new Date().toISOString(),
    },
    [Permission.read(Role.user(userId))],
  );

  log(created);

  return res.json({
    status: "success",
    contestParticipantId: created.$id,
  });
};
