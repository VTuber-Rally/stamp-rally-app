import type { Models } from "appwrite";
import {
  databaseId,
  submissionsCollectionId,
  wheelCollectionId,
} from "@/lib/consts.ts";
import { databases, Query } from "@/lib/appwrite.ts";
import { Standist } from "@/lib/models/Standist.ts";
import { db } from "@/lib/db.ts";
import { QUERY_KEYS } from "@/lib/QueryKeys.ts";
import { useQueryClient } from "@tanstack/react-query";
import { Submission as SubmissionIndexedDB } from "@/lib/models/Submission.ts";

type WithDocument<T> = T & Models.Document;

type Submission = {
  $id: string;
  redeemed: boolean;
  submitted: string; // date

  stamps: {
    $id: string;
    generated: string; // date
    scanned: string; // date
    standist: Standist;
    signature: string;
  }[];
};

type WheelEntry = {
  option: string;
  order: number;
  probability: number;
  disabled: boolean;
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

      db.submissions.update(dbSubmission, {
        redeemed: submission.redeemed,
      });
    }

    return dbSubmissions;
  };

  const getWheelEntries = async () => {
    const docs = await databases.listDocuments<WithDocument<WheelEntry>>(
      databaseId,
      wheelCollectionId,
      [Query.equal("disabled", false)],
    );

    // sort using the order field
    docs.documents.sort((a, b) => {
      console.log(a.order, b.order);
      return a.order - b.order;
    });

    console.log(docs.documents.map((doc) => doc.name));

    return docs.documents.map((doc) => ({
      option: doc.name,
      probability: doc.probability,
    }));
  };

  return {
    getSubmission,
    getOwnSubmissions,
    getWheelEntries,
  };
};
