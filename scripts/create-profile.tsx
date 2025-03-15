/** This script is used to create profiles from a TSV file exported from Google
 *  Sheets. The structure of the sheet is probably not same as yours,
 *  so you will need to adjust the code to match your sheet structure.
 *  To import artists for real, you will need to set the `NODE_ENV` to `production`
 *
 *  Usage: `bun scripts/create-profile.tsx <path-to-tsv-file>`
 *
 *  Example: `bun scripts/create-profile.tsx ./data.tsv`
 *
 **/
import * as fs from "fs";
import * as sdk from "node-appwrite";
import { Permission, Role } from "node-appwrite";
import { randomBytes } from "node:crypto";
import path from "path";

import { getEnv } from "./shared.js";
import { uploadUserMedia } from "./upload-user-medias.js";

const generatePassword = () => randomBytes(32).toString("base64").slice(0, 32);

const {
  APPWRITE_PROJECT_ID,
  APPWRITE_ENDPOINT,
  DATABASE_ID,
  STANDISTS_COLLECTION_ID,
  APPWRITE_API_KEY,
} = getEnv();

const isProduction = process.env.NODE_ENV === "production";

const client = new sdk.Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const users = new sdk.Users(client);
const database = new sdk.Databases(client);

// check if arg is set
if (process.argv.length < 4) {
  throw new Error(
    "File path is not set. Please provide a TSV file path (exported from the Google Sheets) and the path to the folder containing the user medias",
  );
}

const filePath = process.argv[2];
const userMediasPath = process.argv[3];

if (!fs.existsSync(userMediasPath)) {
  throw new Error(`User medias path not found: ${userMediasPath}`);
}

let content = fs.readFileSync(filePath, "utf8");

const lines = content
  .split("\n")
  .map((line) => line.split("\t"))
  .map((line) => {
    return {
      boothName: line[0].trim(),
      boothNumber: line[1].trim(),
      hall: line[2].trim(),
      personalSetOrder: line[3].trim(),
      cost: line[4].trim(),
      artistIn2024Edition: line[5].trim(),
      status: line[6].trim(),
      rewardCard: line[7].trim(),
      comments: line[8].trim(),
      email: line[9].trim(),
      artistName: line[10].trim(),
      goodsDescription: line[11].trim(),
      promotionalLink: line[12].trim(),
      topVTubers: line[13].trim(),
      timestamp: line[14].trim(),
      filename: line[15].trim(),
    } satisfies Line;
  }) as Line[];

//   Your booth name	Booth number	Hall	Personal set order	Cost	Artist in the 2024 edition	Status	Reward card	Comments	Adresse e-mail	Your artist name	Please describe your Vtuber-related goods available on your booth (kind of goods and characters/agency...).	Please give one link for your promotional purposes	The top 3 Vtubers you wanna draw for the postcard, by priority order (top 1, top 2, top 3)	Horodateur	Profile picture filename

type Line = {
  boothName: string;
  boothNumber: string;
  hall: string;
  personalSetOrder: string;
  cost: string;
  artistIn2024Edition: string;
  status: string;
  rewardCard: string;
  comments: string;
  email: string;
  artistName: string;
  goodsDescription: string;
  promotionalLink: string;
  topVTubers: string;
  timestamp: string;
  filename: string;
};

console.log(`Found ${lines.length} profiles`);

async function createProfilesAndDocuments() {
  const creationPromises = lines.map((line) => {
    if (
      line.email === "Adresse e-mail" ||
      line.email === "" ||
      line.boothName === ""
    ) {
      return Promise.resolve(null); // ligne vide
    }
    return (async () => {
      // modify email for testing
      const emailModified = isProduction
        ? line.email
        : line.email.replace("@", "+").concat("@fake.email");
      const password = generatePassword();

      const newAccount = await users.create(
        sdk.ID.unique(),
        emailModified,
        undefined,
        password,
        line.boothName,
      );

      const { privateKey, publicKey } = await crypto.subtle.generateKey(
        { name: "ECDSA", namedCurve: "P-384" },
        true,
        ["sign", "verify"],
      );

      const exportedPrivateKey = await crypto.subtle.exportKey(
        "jwk",
        privateKey,
      );
      const exportedPublicKey = await crypto.subtle.exportKey("jwk", publicKey);

      await users.updatePrefs(newAccount.$id, {
        privateKey: JSON.stringify(exportedPrivateKey),
        publicKey: JSON.stringify(exportedPublicKey),
      });

      await users.updateLabels(newAccount.$id, [
        "standist",
        !isProduction && "test",
      ]);
      await users.updateEmailVerification(newAccount.$id, true);

      console.log(`\`${emailModified}\`:\`${password}\``);

      let imageId = "fallback";
      if (line.filename) {
        const imagePath = path.join(userMediasPath, line.filename);
        if (!fs.existsSync(imagePath)) {
          throw new Error(`Image file not found: ${imagePath}`);
        }
        console.log(`Uploading image: ${imagePath}`);
        imageId = await uploadUserMedia(imagePath);
      }

      return {
        userId: newAccount.$id,
        boothNumber: line.boothNumber,
        name: line.boothName,
        hall: line.hall,
        description: line.goodsDescription,
        publicKey: JSON.stringify(exportedPublicKey),
        image: imageId,
        twitch: line.promotionalLink,
      };
    })();
  });

  const profiles = await Promise.all(creationPromises);
  const documentCreationPromises = profiles
    .filter((profile) => profile !== null)
    .map((profile) => {
      return database.createDocument(
        DATABASE_ID,
        STANDISTS_COLLECTION_ID,
        sdk.ID.unique(),
        profile,
        [
          Permission.read(Role.user(profile.userId)),
          Permission.update(Role.user(profile.userId)),
        ],
      );
    });

  await Promise.all(documentCreationPromises);
}

await createProfilesAndDocuments();
