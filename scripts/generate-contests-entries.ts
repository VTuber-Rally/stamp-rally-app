import { faker } from "@faker-js/faker";
import { Databases, ID } from "node-appwrite";

import { appwriteClient, getEnv } from "./shared.js";

const { DATABASE_ID, CONTEST_PARTICIPANTS_COLLECTION_ID } = getEnv();

const databases = new Databases(appwriteClient);

const generateParticipants = async (count: number) => {
  console.log(`Génération de ${count} participants...`);
  const participants = Array.from({ length: count }, () => ({
    userId: ID.unique(),
    name: faker.internet.username(),
    registeredAt: new Date().toISOString(),
  }));

  await Promise.all(
    participants.map(async (participant) => {
      try {
        await databases.createDocument(
          DATABASE_ID,
          CONTEST_PARTICIPANTS_COLLECTION_ID,
          ID.unique(),
          participant,
        );
        console.log(`✅ Participant créé: ${participant.name}`);
      } catch (error) {
        console.error(
          `❌ Erreur lors de la création de ${participant.name}:`,
          error,
        );
      }
    }),
  );
};

const deleteParticipants = async () => {
  const participants = await databases.listDocuments(
    DATABASE_ID,
    CONTEST_PARTICIPANTS_COLLECTION_ID,
  );
  console.log(`Suppression de ${participants.total} participants...`);
  await Promise.all(
    participants.documents.map(async (participant) => {
      await databases.deleteDocument(
        DATABASE_ID,
        CONTEST_PARTICIPANTS_COLLECTION_ID,
        participant.$id,
      );
    }),
  );
};

const participantCount = process.argv[2] ? parseInt(process.argv[2]) : 10;

if (process.argv[2] === "--rm") {
  deleteParticipants()
    .then(() => {
      console.log("🔥 Participations supprimées");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Erreur:", error);
      process.exit(1);
    });
} else {
  generateParticipants(participantCount)
    .then(() => {
      console.log("✨ Génération terminée");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Erreur:", error);
      process.exit(1);
    });
}
