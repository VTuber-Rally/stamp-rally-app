import { skipToken, useQuery } from "@tanstack/react-query";
import { Query, RealtimeResponseEvent } from "appwrite";
import { useCallback, useEffect } from "react";

import { QUERY_KEYS } from "@/lib/QueryKeys";
import { client, databases } from "@/lib/appwrite";
import { contestParticipantsCollectionId, databaseId } from "@/lib/consts";
import { db } from "@/lib/db";
import { useUser } from "@/lib/hooks/useUser";
import { ContestParticipant } from "@/lib/models/ContestParticipant";
import { queryClient } from "@/lib/queryClient";

export const useFollowParticipation = () => {
  const { user } = useUser();

  const saveParticipationToIndexedDB = useCallback(
    async (participation: ContestParticipant) => {
      const participationDb = await db.contestParticipations.get(
        participation.$id,
      );
      const date = participation.drawnDate
        ? new Date(participation.drawnDate)
        : undefined;

      if (participationDb) {
        await db.contestParticipations.update(participation.$id, {
          isWinner: participation.isWinner,
          drawnDate: date,
        });
      } else {
        await db.contestParticipations.add({
          id: participation.$id,
          submittedAt: new Date(participation.submittedAt),
          isWinner: participation.isWinner ?? false,
          drawnDate: date,
        });
      }
    },
    [],
  );

  const synchroniseAndGetCurrentParticipationId = useCallback(async () => {
    if (!user) {
      throw new Error("Utilisateur non authentifié/pas d'information");
    }

    try {
      const participationsAppwrite =
        await databases.listDocuments<ContestParticipant>(
          databaseId,
          contestParticipantsCollectionId,
          [Query.equal("userId", user.$id), Query.orderDesc("registeredAt")],
        );

      // en parallèle !
      const syncPromises = participationsAppwrite.documents.map(
        (participation) => saveParticipationToIndexedDB(participation),
      );
      await Promise.all(syncPromises);

      const undrawedParticipations = participationsAppwrite.documents.filter(
        (p) => typeof p.drawnDate !== "string",
      );

      if (undrawedParticipations.length > 1) {
        console.warn("Plusieurs participations non tirées au sort détectées");
      }

      if (participationsAppwrite.documents.length === 0) {
        return null;
      }

      // Récupérer la participation la plus ancienne par date de soumission
      return participationsAppwrite.documents.sort(
        (a, b) =>
          new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
      )[0].$id;
    } catch (error) {
      console.error(
        "Erreur lors de la synchronisation des participations:",
        error,
      );
      throw error;
    }
  }, [user, saveParticipationToIndexedDB]);

  const {
    data: currentParticipation,
    isPending: isCurrentParticipationPending,
    error: participationError,
  } = useQuery({
    queryKey: [QUERY_KEYS.CONTEST_CURRENT_PARTICIPATION, user?.$id],
    queryFn: user
      ? async () => {
          const participationId =
            await synchroniseAndGetCurrentParticipationId();

          if (!participationId) {
            console.warn("Aucune participation trouvée pour l'utilisateur");
            return null;
          }

          return await databases.getDocument<ContestParticipant>(
            databaseId,
            contestParticipantsCollectionId,
            participationId,
          );
        }
      : skipToken,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes c'est un peu trop?
    retry: 2,
  });

  // Écouter les mises à jour en temps réel
  useEffect(() => {
    if (!user || !currentParticipation?.$id) return;

    const unsubscribe = client.subscribe(
      `databases.${databaseId}.collections.${contestParticipantsCollectionId}.documents`,
      (response: RealtimeResponseEvent<ContestParticipant>) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update",
          ) &&
          response.payload.userId === user.$id // surtout pour les admins
        ) {
          console.log(
            "Mise à jour reçue pour la participation:",
            response.payload.$id,
          );

          // Mettre à jour IndexedDB
          db.contestParticipations.update(response.payload.$id, {
            isWinner: response.payload.isWinner,
            drawnDate: response.payload.drawnDate
              ? new Date(response.payload.drawnDate)
              : undefined,
          });

          // ça ne devrait jamais arriver, mais on vérifie quand même si c'est bien la dernière participation qui est mise à jour
          if (response.payload.$id !== currentParticipation?.$id) {
            console.warn(
              "La participation mise à jour n'est pas la dernière !",
            );
            return;
          }

          // directement mettre à jour les données dans le cache de tanstack query,
          // pour éviter un fetch inutile
          queryClient.setQueryData(
            [QUERY_KEYS.CONTEST_CURRENT_PARTICIPATION, user?.$id],
            response.payload,
          );
        }
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user, currentParticipation?.$id]);

  return {
    currentParticipation,
    isCurrentParticipationPending,
    participationError,
  };
};
