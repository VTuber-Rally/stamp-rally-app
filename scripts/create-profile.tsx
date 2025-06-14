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

import { StandistDocument } from "@vtube-stamp-rally/shared-lib/models/Standist.ts";

import { appwriteClient, debugPrint, env, isProduction } from "./shared.js";
import { uploadUserMedia } from "./upload-user-medias.js";

const generatePassword = () => randomBytes(32).toString("base64").slice(0, 32);

const { DATABASE_ID, STANDISTS_COLLECTION_ID } = env;

const users = new sdk.Users(appwriteClient);
const database = new sdk.Databases(appwriteClient);

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

const content = fs.readFileSync(filePath, "utf8");

const lines = content
  .split("\n")
  .map((line) => line.split("\t"))
  .filter((line) => {
    return line[0] !== "Your booth name";
  })
  .map((line) => {
    return {
      boothName: line[0]?.trim(),
      boothNumber: line[1]?.trim(),
      hall: line[2]?.trim(),
      personalSetOrder: line[3]?.trim(),
      cost: line[4]?.trim(),
      artistIn2024Edition: line[5]?.trim(),
      status: line[7]?.trim(),
      spokenLanguages: line[8]?.trim(),
      hasProvidedPromoAssets: line[9]?.trim(),
      comments: line[10]?.trim(),
      algorithmicRewardCard: line[11]?.trim(),
      artisticRewardCard: line[12]?.trim(),
      topVTubers: line[13]?.trim(),
      finalRewardCard: line[14]?.trim(),
      promotionalLink: line[15]?.trim(),
      email: line[16]?.trim(),
      artistName: line[17]?.trim(),
      goodsDescription: line[18]?.trim(),
      timestamp: line[19]?.trim(),
      filename: line[20]?.trim(),
      rewardCardFile: line[21]?.trim(),
    } satisfies Line;
  }) as Line[];

// Your booth name	Booth number	Hall	Personal set order	Cost	Artist in the 2024 edition	Promo art	Status	Spoken languages	Has provided promo assets	Comments	"Algorithmic" reward card	"Artistic" / Sedeto's pick reward card	The top 3 Vtubers you wanna draw for the postcard, by priority order (top 1, top 2, top 3)	Final reward card	Please give one link for your promotional purposes	Adresse e-mail	Your artist name	Please describe your Vtuber-related goods available on your booth (kind of goods and characters/agency...).	Horodateur	Profile picture filename	Reward card file

type Line = {
  boothName: string;
  boothNumber: string;
  hall: string;
  personalSetOrder: string;
  cost: string;
  artistIn2024Edition: string;
  status: string;
  spokenLanguages: string;
  hasProvidedPromoAssets: string;
  comments: string;
  algorithmicRewardCard: string;
  artisticRewardCard: string;
  topVTubers: string;
  finalRewardCard: string;
  promotionalLink: string;
  email: string;
  artistName: string;
  goodsDescription: string;
  timestamp: string;
  filename: string;
  rewardCardFile: string;
};

console.log(`Found ${lines.length} profiles`);

async function createProfilesAndDocuments() {
  const creationPromises = lines.map<Promise<Partial<StandistDocument> | null>>(
    async (line) => {
      if (
        line.email === "Adresse e-mail" ||
        line.email === "" ||
        line.boothName === ""
      ) {
        return null; // ligne vide
      }

      // modify email for testing
      const emailModified = isProduction
        ? line.email
        : line.email.replace("@", "+").concat("@fake.email");
      const password = generatePassword();

      try {
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
        const exportedPublicKey = await crypto.subtle.exportKey(
          "jwk",
          publicKey,
        );

        await users.updatePrefs(newAccount.$id, {
          privateKey: JSON.stringify(exportedPrivateKey),
          publicKey: JSON.stringify(exportedPublicKey),
        });

        await users.updateLabels(newAccount.$id, [
          "standist",
          ...(isProduction ? [] : ["test"]),
        ]);
        await users.updateEmailVerification(newAccount.$id, true);

        console.log(`\`${emailModified}\`:\`${password}\``);

        let imageId = "fallback";
        if (line.filename) {
          const imagePath = path.join(userMediasPath, line.filename);
          if (!fs.existsSync(imagePath)) {
            throw new Error(`Image file not found: ${imagePath}`);
          }
          debugPrint(`Uploading image: ${imagePath}`);
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
        } satisfies Partial<StandistDocument>;
      } catch (error) {
        console.error(`Error creating account for ${emailModified}: ${error}`);
        return null;
      }
    },
  );

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
