import * as fs from "fs";
import * as sdk from "node-appwrite";
import path from "path";

import { StandistDocument } from "@vtube-stamp-rally/shared-lib/models/Standist.js";

import { appwriteClient, env } from "./shared.js";
import { uploadMedia } from "./upload-media.ts";
import { Group } from "@vtube-stamp-rally/shared-lib/models/Inventory.ts";

const { DATABASE_ID, STANDISTS_COLLECTION_ID, BUCKET_ID } = env;
const CARD_DESIGNS_COLLECTION_ID = "card_designs";
const CARD_HISTORY_COLLECTION_ID = "card_history";
const CARDS_COLLECTION_ID = "cards";
const GROUPS_COLLECTION_ID = "groups";

const database = new sdk.Databases(appwriteClient);
const storage = new sdk.Storage(appwriteClient);

if (process.argv[2] === "--reset") {
  try {
    await Promise.all([
      database
        .listDocuments(DATABASE_ID, CARD_DESIGNS_COLLECTION_ID)
        .then((res) =>
          Promise.all(
            res.documents.map((doc) =>
              database.deleteDocument(
                DATABASE_ID,
                CARD_DESIGNS_COLLECTION_ID,
                doc.$id,
              ),
            ),
          ),
        ),
      database
        .listDocuments(DATABASE_ID, CARD_HISTORY_COLLECTION_ID)
        .then((res) =>
          Promise.all(
            res.documents.map((doc) =>
              database.deleteDocument(
                DATABASE_ID,
                CARD_HISTORY_COLLECTION_ID,
                doc.$id,
              ),
            ),
          ),
        ),
      database
        .listDocuments(DATABASE_ID, CARDS_COLLECTION_ID, [
          sdk.Query.limit(1000),
        ])
        .then((res) =>
          Promise.all(
            res.documents.map((doc) =>
              database.deleteDocument(
                DATABASE_ID,
                CARDS_COLLECTION_ID,
                doc.$id,
              ),
            ),
          ),
        ),
      database
        .listDocuments(DATABASE_ID, GROUPS_COLLECTION_ID)
        .then((res) =>
          Promise.all(
            res.documents.map((doc) =>
              database.deleteDocument(
                DATABASE_ID,
                GROUPS_COLLECTION_ID,
                doc.$id,
              ),
            ),
          ),
        ),
      storage
        .listFiles(BUCKET_ID)
        .then((res) =>
          Promise.all(
            res.files
              .filter((file) => /.*-by-.*-card.jpg$/.test(file.name))
              .map((file) => storage.deleteFile(BUCKET_ID, file.$id)),
          ),
        ),
    ]);
    console.log("Réinitialisation terminée avec succès");
  } catch (error) {
    console.error("Erreur lors de la réinitialisation:", error);
    process.exit(1);
  }
  process.exit(0);
}

// check if arg is set
if (process.argv.length < 4) {
  throw new Error(
    "File path is not set. Please provide a folder containing the cards named 'xxx-by-xxx-card.jpg', and the path to the groups.csv file",
  );
}

const cardsPath = process.argv[2];
const groupsFilePath = process.argv[3];

if (!fs.existsSync(cardsPath)) {
  throw new Error(`Cards path not found: ${cardsPath}`);
}

if (!fs.existsSync(groupsFilePath)) {
  throw new Error(`Groups file path not found: ${groupsFilePath}`);
}

const groupsLines = fs.readFileSync(groupsFilePath, "utf8");
const groups = groupsLines
  .split("\n")
  .filter((line, index) => index !== 0 && line !== "")
  .map((line) => {
    const [group, start, end, numberOfCards, coefficient] = line.split(",");
    return {
      group: parseInt(group),
      start: new Date(start),
      end: new Date(end),
      numberOfCardsPerDesign: parseInt(numberOfCards),
      coefficient: parseFloat(coefficient),
    };
  });

console.log(groups);

const content = fs.readdirSync(cardsPath, "utf8");

const standists = await database
  .listDocuments<StandistDocument>(DATABASE_ID, STANDISTS_COLLECTION_ID)
  .then((res) => res.documents)
  .then((docs) =>
    docs.map((doc) => {
      return {
        artistId: doc.$id,
        artistName: doc.name,
      };
    }),
  );

type CardDesignInternal = {
  name: string;
  author: string;
  fileName: string;
  standistId: string;
};

const cards: CardDesignInternal[] = content
  .filter((fileName) => /.+-by-.+-.+-card.jpg/.test(fileName))
  .map((fileName) => {
    const [name, , author, standName] = fileName.split("-");
    console.log(`${name} by ${author}`);

    // try to find the author in standists
    const standist = standists.find(
      (standist) =>
        standist.artistName.toLowerCase().includes(standName.toLowerCase()) ||
        standName.toLowerCase().includes(standist.artistName.toLowerCase()),
    );
    if (!standist) {
      console.log(`Standist not found for ${author}`);
    }

    return {
      name,
      author,
      fileName,
      standistId: standist?.artistId,
    } satisfies CardDesignInternal;
  });

async function createCardDesigns() {
  const designs: {
    $id: string;
    name: string;
    author: string;
    image: string;
    standist?: string;
  }[] = [];

  const uploadMediaPromises = cards.map(async (card) => {
    const cardPath = path.join(cardsPath, card.fileName);
    if (!fs.existsSync(cardPath)) {
      throw new Error(`Card file not found: ${cardPath}`);
    }
    const id = await uploadMedia(cardPath);

    // créons les designs
    const designId = await database.createDocument(
      DATABASE_ID,
      CARD_DESIGNS_COLLECTION_ID,
      sdk.ID.unique(),
      {
        name: card.name,
        author: card.author,
        image: id,
        standist: card.standistId,
      },
    );
    designs.push({
      $id: designId.$id,
      name: card.name,
      author: card.author,
      image: id,
    });
  });

  await Promise.all(uploadMediaPromises);
  console.log(designs);

  return designs;
}

const designs = await createCardDesigns();

// créations des groupes
async function createGroups() {
  const groupsA: {
    $id: string;
    groupId: number;
    start: Date;
    end: Date;
    numberOfCardsPerDesign: number;
    coefficient: number;
  }[] = [];

  for (const group of groups) {
    const groupId = await database.createDocument<Group>(
      DATABASE_ID,
      GROUPS_COLLECTION_ID,
      group.group.toString(),
      {
        groupId: group.group,
        start: group.start,
        end: group.end,
        coefficient: group.coefficient,
        numberOfCardsPerDesign: group.numberOfCardsPerDesign,
      },
    );
    groupsA.push({
      $id: groupId.$id,
      groupId: group.group,
      start: group.start,
      end: group.end,
      numberOfCardsPerDesign: group.numberOfCardsPerDesign,
      coefficient: group.coefficient,
    });
  }

  return groupsA;
}

const groupsAppwrite = await createGroups();
console.log(groupsAppwrite);

groupsAppwrite.forEach(async (group) => {
  designs.forEach(async (design) => {
    for (let i = 0; i < group.numberOfCardsPerDesign; i++) {
      const cardId = await database.createDocument(
        DATABASE_ID,
        CARDS_COLLECTION_ID,
        sdk.ID.unique(),
        {
          cardDesign: design.$id,
          group: group.$id,
          cardHistory: [
            {
              group: group.$id,
              timestamp: new Date(),
              type: "initial",
            },
          ],
        },
      );
      console.log(
        `Created card ${cardId.$id} for design ${design.$id} in group ${group.$id}`,
      );
    }
  });
});

// // prend un design et la liste des groupes et crée les cartes associées
// async function createCardsByDesign()

// Your booth name	Booth number	Hall	Personal set order	Cost	Artist in the 2024 edition	Promo art	Status	Spoken languages	Has provided promo assets	Comments	"Algorithmic" reward card	"Artistic" / Sedeto's pick reward card	The top 3 Vtubers you wanna draw for the postcard, by priority order (top 1, top 2, top 3)	Final reward card	Please give one link for your promotional purposes	Adresse e-mail	Your artist name	Please describe your Vtuber-related goods available on your booth (kind of goods and characters/agency...).	Horodateur	Profile picture filename	Reward card file

// console.log(`Found ${lines.length} profiles`);

// async function createProfilesAndDocuments() {
//   const creationPromises = lines.map<Promise<Partial<StandistDocument> | null>>(
//     async (line) => {
//       if (
//         line.email === "Adresse e-mail" ||
//         line.email === "" ||
//         line.boothName === ""
//       ) {
//         return null; // ligne vide
//       }

//       // modify email for testing
//       const emailModified = isProduction
//         ? line.email
//         : line.email.replace("@", "+").concat("@fake.email");
//       const password = generatePassword();

//       try {
//         const newAccount = await users.create(
//           sdk.ID.unique(),
//           emailModified,
//           undefined,
//           password,
//           line.boothName,
//         );

//         const { privateKey, publicKey } = await crypto.subtle.generateKey(
//           { name: "ECDSA", namedCurve: "P-384" },
//           true,
//           ["sign", "verify"],
//         );

//         const exportedPrivateKey = await crypto.subtle.exportKey(
//           "jwk",
//           privateKey,
//         );
//         const exportedPublicKey = await crypto.subtle.exportKey(
//           "jwk",
//           publicKey,
//         );

//         await users.updatePrefs(newAccount.$id, {
//           privateKey: JSON.stringify(exportedPrivateKey),
//           publicKey: JSON.stringify(exportedPublicKey),
//         });

//         await users.updateLabels(newAccount.$id, [
//           "standist",
//           ...(isProduction ? [] : ["test"]),
//         ]);
//         await users.updateEmailVerification(newAccount.$id, true);

//         console.log(`\`${emailModified}\`:\`${password}\``);

//         let imageId = "fallback";
//         if (line.filename) {
//           const imagePath = path.join(userMediasPath, line.filename);
//           if (!fs.existsSync(imagePath)) {
//             throw new Error(`Image file not found: ${imagePath}`);
//           }
//           console.log(`Uploading image: ${imagePath}`);
//           imageId = await uploadMedia(imagePath);
//         }

//         return {
//           userId: newAccount.$id,
//           boothNumber: line.boothNumber,
//           name: line.boothName,
//           hall: line.hall,
//           description: line.goodsDescription,
//           publicKey: JSON.stringify(exportedPublicKey),
//           image: imageId,
//           twitch: line.promotionalLink,
//         } satisfies Partial<StandistDocument>;
//       } catch (error) {
//         console.error(`Error creating account for ${emailModified}: ${error}`);
//         return null;
//       }
//     },
//   );

//   const profiles = await Promise.all(creationPromises);
//   const documentCreationPromises = profiles
//     .filter((profile) => profile !== null)
//     .map((profile) => {
//       return database.createDocument(
//         DATABASE_ID,
//         STANDISTS_COLLECTION_ID,
//         sdk.ID.unique(),
//         profile,
//         [
//           Permission.read(Role.user(profile.userId)),
//           Permission.update(Role.user(profile.userId)),
//         ],
//       );
//     });

//   await Promise.all(documentCreationPromises);
// }

// await createProfilesAndDocuments();
