import { useQueryClient } from "@tanstack/react-query";
import type { Models } from "appwrite";

import { KeyValue } from "@vtube-stamp-rally/shared-lib/models/KeyValue.ts";
import { Standist } from "@vtube-stamp-rally/shared-lib/models/Standist.ts";
import { Submission as SubmissionIndexedDB } from "@vtube-stamp-rally/shared-lib/models/Submission.ts";

import { StandistsEditProfileForm } from "@/components/routes/standists/StandistsProfilePage.tsx";
import { QUERY_KEYS } from "@/lib/QueryKeys.ts";
import { Query, databases } from "@/lib/appwrite.ts";
import {
  databaseId,
  keyValueCollectionId,
  prizesCollectionId,
  standistsCollectionId,
  submissionsCollectionId,
} from "@/lib/consts.ts";
import { db } from "@/lib/db.ts";
import { Prize } from "@/lib/rewards.ts";

type WithDocument<T> = T & Models.Document;

type Submission = {
  $id: string;
  redeemed: boolean;
  submitted: string; // date

  stamps: {
    $id: string;
    expiry: string; // date
    scanned: string; // date
    standist: Standist;
    signature: string;
  }[];
};

export const useDatabase = () => {
  const queryClient = useQueryClient();

  const getSubmission = async (documentId: string) => {
    const resp = await databases.getDocument<WithDocument<Submission>>(
      databaseId,
      submissionsCollectionId,
      documentId,
    );

    return resp as Submission; // we don't care about appwrite's additionnal infos
  };

  const getOwnSubmissions = async (userId: string) => {
    const dbSubmissions = await db.submissions.toArray();

    const { documents } = await databases.listDocuments<
      WithDocument<SubmissionIndexedDB>
    >(databaseId, submissionsCollectionId, [Query.equal("userId", userId)]);

    for (const submission of documents) {
      const dbSubmission = dbSubmissions.find(
        (sub) => sub.submissionId === submission.$id,
      );

      if (!dbSubmission) {
        // if it's not in local db, we add it
        await db.submissions.add({
          submissionId: submission.$id,
          stamps: submission.stamps,
          submitted: new Date(submission.submitted),
          redeemed: submission.redeemed,
        });
        continue;
      }

      if (dbSubmission.redeemed === submission.redeemed) {
        continue;
      }

      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SUBMISSION, submission.id],
      });

      await db.submissions.update(dbSubmission, {
        redeemed: submission.redeemed,
      });
    }

    return dbSubmissions;
  };

  const getPrizes = async () => {
    const docs = await databases.listDocuments<WithDocument<Prize>>(
      databaseId,
      prizesCollectionId,
    );

    // sort using the order field
    docs.documents.sort((a, b) => {
      return a.order - b.order;
    });

    return docs.documents;
  };

  const getKeyValue = async (key: string) => {
    const doc = await databases.listDocuments<KeyValue>(
      databaseId,
      keyValueCollectionId,
      [Query.equal("key", key)],
    );

    if (doc.documents.length === 0) {
      throw new Error("Key not found");
    }

    return doc.documents[0];
  };

  const findAndUpdateProfile = async (
    userId: string,
    profileData: StandistsEditProfileForm,
  ) => {
    const userDocument = await databases.listDocuments(
      databaseId,
      standistsCollectionId,
      [Query.equal("userId", userId)],
    );

    if (userDocument.documents.length === 0) {
      throw new Error("User not found");
    }

    const documentToUpdateId = userDocument.documents[0].$id;

    return await databases.updateDocument(
      databaseId,
      standistsCollectionId,
      documentToUpdateId,
      profileData,
    );
  };

  return {
    getSubmission,
    getOwnSubmissions,
    getPrizes,
    getKeyValue,
    findAndUpdateProfile,
  };
};
