import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { QUERY_KEYS } from "@/lib/QueryKeys";
import { databases } from "@/lib/appwrite";
import { contestParticipantsCollectionId, databaseId } from "@/lib/consts";
import type { ContestParticipant } from "@/lib/models/ContestParticipant";
import { queryClient } from "@/lib/queryClient";

export function useContestDrawWinner(
  participants: ContestParticipant[] | undefined,
) {
  const [winner, setWinner] = useState<ContestParticipant | null>(null);
  const [isWinnerDrawn, setIsWinnerDrawn] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isDrumRoll, setIsDrumRoll] = useState(false);

  const resetDraw = useCallback(() => {
    setWinner(null);
    setIsWinnerDrawn(false);
    setIsDrawing(false);
    setCountdown(null);
    setIsDrumRoll(false);
  }, []);

  const drawWinner = useCallback(async () => {
    if (!participants || participants.length === 0) {
      // ou throw? en vrai je sais pas trop
      return;
    }

    setIsDrawing(true);
    setCountdown(3);

    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Sélection du gagnant
    const randomIndex = Math.floor(Math.random() * participants.length);
    const selectedWinner = participants[randomIndex];
    setWinner(selectedWinner);
    setIsDrawing(false);
    setCountdown(null);
    setIsDrumRoll(true);

    // drum roll pour le suspense car je suis un poti rigolo
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsDrumRoll(false);
    setIsWinnerDrawn(true);
  }, [participants]);

  const { mutate: updateWinner } = useMutation({
    mutationFn: async () => {
      if (!winner) {
        return;
      }

      await databases.updateDocument(
        databaseId,
        contestParticipantsCollectionId,
        winner.$id,
        {
          drawnDate: new Date().toISOString(),
          isWinner: true,
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONTEST_WINNERS],
      });
    },
  });

  const { mutate: updateDayDrawn } = useMutation({
    mutationFn: async () => {
      participants
        ?.filter((participant) => participant.$id !== winner?.$id)
        .filter((participant) => participant.drawnDate === null)
        .forEach(async (participant) => {
          await databases.updateDocument(
            databaseId,
            contestParticipantsCollectionId,
            participant.$id,
            {
              drawnDate: new Date().toISOString(),
            },
          );
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONTEST_PARTICIPANTS],
      });
    },
  });

  return {
    drawWinner,
    resetDraw,
    updateWinner,
    updateDayDrawn,
    isWinnerDrawn,
    isDrawing,
    countdown,
    isDrumRoll,
    winner,
  };
}
