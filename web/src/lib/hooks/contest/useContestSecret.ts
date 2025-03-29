import { useMutation } from "@tanstack/react-query";
import { ID, Query } from "appwrite";
import { useTranslation } from "react-i18next";

import { QUERY_KEYS } from "@/lib/QueryKeys";
import { databases } from "@/lib/appwrite";
import { databaseId, keyValueCollectionId } from "@/lib/consts";
import { useToast } from "@/lib/hooks/useToast";
import { queryClient } from "@/lib/queryClient";

export const useContestSecret = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { mutate: resetContestSecret, isPending } = useMutation({
    mutationFn: async () => {
      const secret = crypto
        .getRandomValues(new BigUint64Array(4))
        .reduce((acc, val) => acc + val.toString(36), "");

      const { documents } = await databases.listDocuments(
        databaseId,
        keyValueCollectionId,
        [Query.equal("key", "contestRegistrationSecret")],
      );

      if (documents.length === 1) {
        return await databases.updateDocument(
          databaseId,
          keyValueCollectionId,
          documents[0].$id,
          { key: "contestRegistrationSecret", value: secret },
        );
      }

      return await databases.createDocument(
        databaseId,
        keyValueCollectionId,
        ID.unique(),
        { key: "contestRegistrationSecret", value: secret },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONTEST_SECRET],
      });
      toast({
        title: t("contest.staff.secret.updated.title"),
        description: t("contest.staff.secret.updated.description"),
      });
    },
  });

  return { resetContestSecret, isLoading: isPending };
};
