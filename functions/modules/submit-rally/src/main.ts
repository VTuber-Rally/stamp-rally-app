import { Client, Databases, ID, Permission, Query, Role } from "node-appwrite";

import { dataUrlToBytes } from "@vtube-stamp-rally/shared-lib/base64.ts";
import { importJWK } from "@vtube-stamp-rally/shared-lib/crypto.ts";
import { SubmitRallyFunctionRequestValidator } from "@vtube-stamp-rally/shared-lib/functions/submitRally.ts";
import { SubmitRallyFunctionResponse } from "@vtube-stamp-rally/shared-lib/functions/submitRally.ts";
import {
  Standist,
  StandistDocument,
} from "@vtube-stamp-rally/shared-lib/models/Standist.ts";
import type { Context } from "@vtube-stamp-rally/shared-lib/types.ts";

const SUBMISSION_DATABASE_ID = process.env["DATABASE_ID"];
const SUBMISSION_COLLECTION_ID = process.env["SUBMISSIONS_COLLECTION_ID"];
const PROFILE_COLLECTION_ID = process.env["STANDISTS_COLLECTION_ID"];
const STANDARD_REWARD_MIN_STAMPS_REQUIREMENT =
  process.env["STANDARD_REWARD_MIN_STAMPS_REQUIREMENT"];

const signAlgorithm = {
  name: "ECDSA",
  hash: { name: "SHA-384" },
} as const;

const textEncoder = new TextEncoder();

export default async ({
  req,
  res,
  log,
  error,
}: Context<SubmitRallyFunctionResponse>) => {
  const missingVars = [];
  if (!SUBMISSION_DATABASE_ID) missingVars.push("DATABASE_ID");
  if (!SUBMISSION_COLLECTION_ID) missingVars.push("SUBMISSIONS_COLLECTION_ID");
  if (!PROFILE_COLLECTION_ID) missingVars.push("STANDISTS_COLLECTION_ID");
  if (!STANDARD_REWARD_MIN_STAMPS_REQUIREMENT)
    missingVars.push("STANDARD_REWARD_MIN_STAMPS_REQUIREMENT");

  // writing it in a way that the TS compiler will see through
  if (
    !SUBMISSION_DATABASE_ID ||
    !SUBMISSION_COLLECTION_ID ||
    !PROFILE_COLLECTION_ID ||
    !STANDARD_REWARD_MIN_STAMPS_REQUIREMENT
  ) {
    log(`Missing/invalid environment variables: ${missingVars.join(", ")}`);
    log(
      `Available environment variables: ${Object.keys(process.env).join(", ")}`,
    );
    throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
  }

  const standardRewardMinStampsRequirement = Number.parseInt(
    STANDARD_REWARD_MIN_STAMPS_REQUIREMENT,
    10,
  );
  if (
    !Number.isFinite(standardRewardMinStampsRequirement) ||
    standardRewardMinStampsRequirement <= 0
  ) {
    throw new Error(
      "STANDARD_REWARD_MIN_STAMPS_REQUIREMENT must be a positive integer",
    );
  }

  log(req.body);
  const { success: isDataValid, data: inputData } =
    SubmitRallyFunctionRequestValidator.safeParse(JSON.parse(req.body));

  if (!isDataValid) {
    return res.send("", 400);
  }

  const client = new Client()
    .setEndpoint(process.env["APPWRITE_FUNCTION_API_ENDPOINT"]!)
    .setProject(process.env["APPWRITE_FUNCTION_PROJECT_ID"]!)
    .setKey(req.headers["x-appwrite-key"]);

  const userId = req.headers["x-appwrite-user-id"];

  const database = new Databases(client);

  const { documents: standists } =
    await database.listDocuments<StandistDocument>(
      SUBMISSION_DATABASE_ID,
      PROFILE_COLLECTION_ID,
    );

  console.time("Signatures import");
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
        publicKey: await importJWK(JSON.parse(publicKey) as JsonWebKey),
        name,
        hall,
        boothNumber,
        description,
        image,
        twitter,
        instagram,
        twitch,
      };
    }),
  );
  console.timeEnd("Signatures import");

  const stamps = inputData.stamps;

  log(stamps);

  if (stamps.length < standardRewardMinStampsRequirement) {
    error("Not enough stamps.");
    return res.json({ status: "error", message: "Not enough stamps." });
  }

  // first, let's check that every signature are valid
  let isAnyStampFromMinorHall = false;
  for (const stamp of stamps) {
    const standist = standistsList.find(
      (standist) => standist.userId === stamp.standistId,
    );

    if (!standist) {
      throw new Error("Standist not found.");
    }

    const signature = await dataUrlToBytes(stamp.signature);
    log("signature: ");
    log(signature);

    const dataToBeEncoded = [stamp.standistId, stamp.expiryTimestamp].join(":");

    const isValid = await crypto.subtle.verify(
      signAlgorithm,
      standist.publicKey,
      signature,
      textEncoder.encode(dataToBeEncoded),
    );

    if (!isValid) {
      error("Invalid signature.");
      return res.json({ status: "error", message: "Invalid signature" });
    }

    log(`Signature is valid for ${stamp.standistId} - ${standist.name}.`);

    if (standist.hall === "5A") {
      isAnyStampFromMinorHall = true;
    }
  }

  if (!isAnyStampFromMinorHall) {
    error("Minor hall stamp missing.");
    return res.json({ status: "error", message: "Minor hall stamp missing" });
  }

  const stampPromises = stamps.map(async (stamp) => {
    // get standist's document id from its userid
    const { documents } = await database.listDocuments(
      SUBMISSION_DATABASE_ID,
      PROFILE_COLLECTION_ID,
      [Query.equal("userId", stamp.standistId)],
    );

    if (documents.length === 0 || documents.length > 1) {
      throw new Error("Standist not found or multiple found.");
    }

    const standist = documents[0];

    return {
      standist: standist.$id,
      expiry: new Date(stamp.expiryTimestamp).toISOString(),
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
    [Permission.read(Role.user(userId))],
  );

  return res.json({ status: "success", submissionId });
};
