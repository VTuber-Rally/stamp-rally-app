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

import * as sdk from "node-appwrite";
import * as fs from "fs";
import { getEnv } from "./shared.js";

const {
  APPWRITE_PROJECT_ID,
  APPWRITE_ENDPOINT,
  PROFILE_DATABASE_ID,
  PROFILE_COLLECTION_ID,
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
if (process.argv.length < 3) {
  throw new Error(
    "File path is not set. Please provide a TSV file path (exported from the Google Sheets)",
  );
}

const filePath = process.argv[2];
let content = fs.readFileSync(filePath, "utf8");

const lines = content
  .split("\n")
  .map((line) => line.split("\t"))
  .map((line) => {
    return {
      horodateur: line[0].trim(),
      set: line[1].trim(),
      paiement: line[2].trim(),
      email: line[3].trim(),
      artistName: line[4].trim(),
      boothName: line[5].trim(),
      shikishi: line[6].trim(),
      print: line[7].trim(),
      favVtubers: line[8].trim(),
      boothNumber: line[9].trim(),
      hall: line[10].trim(),
      description: line[11].trim(),
      vtuber: line[12].trim(),
      streamingPlatform: line[13].trim(),
      streamingPlatformUrl: line[14].trim(),
      printFees: line[15].trim(),
      contribution: line[16].trim(),
      twitter: line[17].trim(),
      insta: line[18].trim(),
      image: line[19].trim(),
    } satisfies Line;
  }) as Line[];

//   Horodateur	set	paiement	Adresse e-mail	Your artist name	Your booth name	Shikishi réalisé	PRINT	Your fav 3 vtubers you wanna draw for the shikishi postcard, by priority order (number 1, number 2, number 3)(please try to prioritize by popularity in order to motivate people for the rally!)	Booth number	Hall	Description	You're a vtuber yourself (preferably active, around 1 stream/month-ish)	If yes, link your streaming platform URL (youtube, twitch)	Please give one link	Do you want to participate to print fees instead of make a shikishi illustration?	Contribution	Twitter	Insta
type Line = {
  horodateur: string;
  set: string;
  paiement: string;
  email: string;
  artistName: string;
  boothName: string;
  shikishi: string;
  print: string;
  favVtubers: string;
  boothNumber: string;
  hall: string;
  description: string;
  vtuber: string;
  streamingPlatform: string;
  streamingPlatformUrl: string;
  printFees: string;
  contribution: string;
  twitter: string;
  insta: string;
  image: string;
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
      const password = Array.from(
        { length: 16 },
        () => Math.random().toString(36)[2],
      ).join("");

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

      console.log(`${emailModified}:${password}`);

      return {
        userId: newAccount.$id,
        boothNumber: line.boothNumber,
        name: line.boothName,
        hall: line.hall,
        description: line.description,
        publicKey: JSON.stringify(exportedPublicKey),
        image: line.image,
        twitter: line.twitter,
        instagram: line.insta,
        twitch: line.streamingPlatformUrl,
      };
    })();
  });

  const profiles = await Promise.all(creationPromises);
  const documentCreationPromises = profiles
    .filter((profile) => profile !== null)
    .map((profile) => {
      return database.createDocument(
        PROFILE_DATABASE_ID,
        PROFILE_COLLECTION_ID,
        sdk.ID.unique(),
        profile,
      );
    });

  await Promise.all(documentCreationPromises);
}

await createProfilesAndDocuments();
