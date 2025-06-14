import * as fs from "fs";
import * as sdk from "node-appwrite";
import path from "path";

import { Group } from "@vtube-stamp-rally/shared-lib/models/Inventory.ts";
import { StandistDocument } from "@vtube-stamp-rally/shared-lib/models/Standist.js";

import { appwriteClient, env } from "./shared.js";
import { uploadMedia } from "./upload-media.ts";

const {
  DATABASE_ID,
  STANDISTS_COLLECTION_ID,
  BUCKET_ID,
  CARDS_COLLECTION_ID,
  CARD_DESIGNS_COLLECTION_ID,
  CARD_HISTORY_COLLECTION_ID,
  GROUPS_COLLECTION_ID,
} = env;

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
    "File path is not set. Please provide a folder containing the cards named 'xxx-by-xxx-standName-card.jpg', and the path to the groups.csv file",
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
    const [group, start, end, numberOfCards, numberOfHoloCards, coefficient] =
      line.split(",");
    return {
      group: parseInt(group),
      start: new Date(start),
      end: new Date(end),
      numberOfCardsPerDesign: parseInt(numberOfCards),
      numberOfHoloCardsPerDesign: parseInt(numberOfHoloCards),
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
  const groupsAppwrite: Group[] = [];

  for (const group of groups) {
    const groupAppwrite = await database.createDocument<Group>(
      DATABASE_ID,
      GROUPS_COLLECTION_ID,
      group.group.toString(),
      {
        groupId: group.group,
        start: group.start,
        end: group.end,
        coefficient: group.coefficient,
        numberOfCardsPerDesign: group.numberOfCardsPerDesign,
        numberOfHoloCardsPerDesign: group.numberOfHoloCardsPerDesign,
      },
    );
    groupsAppwrite.push(groupAppwrite);
  }

  return groupsAppwrite;
}

const groupsAppwrite = await createGroups();
console.log(groupsAppwrite);

for (const group of groupsAppwrite) {
  for (const design of designs) {
    for (let i = 0; i < group.numberOfCardsPerDesign; i++) {
      const cardId = await database.createDocument(
        DATABASE_ID,
        CARDS_COLLECTION_ID,
        sdk.ID.unique(),
        {
          cardDesign: design.$id,
          group: group.$id,
          type: "classic",
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
    for (let i = 0; i < group.numberOfHoloCardsPerDesign; i++) {
      const cardId = await database.createDocument(
        DATABASE_ID,
        CARDS_COLLECTION_ID,
        sdk.ID.unique(),
        {
          cardDesign: design.$id,
          group: group.$id,
          type: "holo",
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
        `Created holo card ${cardId.$id} for design ${design.$id} in group ${group.$id}`,
      );
    }
  }
}
