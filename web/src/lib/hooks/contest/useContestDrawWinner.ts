import { useMutation } from "convex/react";
import { useCallback, useState } from "react";

import { type ConvexDataModel, convexPublicApi } from "@/lib/convex";

type ContestParticipation =
  ConvexDataModel["contestParticipations"]["document"];

export function useContestDrawWinner(
  participants: ContestParticipation[] | undefined,
) {
  const [winner, setWinner] = useState<ContestParticipation | null>(null);
  const [isWinnerDrawn, setIsWinnerDrawn] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isDrumRoll, setIsDrumRoll] = useState(false);

  const markWinnerMutation = useMutation(convexPublicApi.contest.markWinner);
  const markAllDrawnMutation = useMutation(
    convexPublicApi.contest.markAllDrawn,
  );

  const resetDraw = useCallback(() => {
    setWinner(null);
    setIsWinnerDrawn(false);
    setIsDrawing(false);
    setCountdown(null);
    setIsDrumRoll(false);
  }, []);

  const drawWinner = useCallback(async () => {
    if (!participants || participants.length === 0) {
      console.error("No participants found");
      throw new Error("No participants found");
    }

    setIsDrawing(true);
    setCountdown(3);

    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Select a random winner
    const randomIndex = Math.floor(Math.random() * participants.length);
    const selectedWinner = participants[randomIndex];
    setWinner(selectedWinner);
    setIsDrawing(false);
    setCountdown(null);
    setIsDrumRoll(true);

    // Drum roll for suspense
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsDrumRoll(false);
    setIsWinnerDrawn(true);
  }, [participants]);

  const updateWinner = useCallback(async () => {
    if (!winner) return;
    await markWinnerMutation({ participationId: winner._id });
  }, [markWinnerMutation, winner]);

  const updateDayDrawn = useCallback(async () => {
    if (!participants) return;

    await markAllDrawnMutation({
      participationIds: participants.map((participant) => participant._id),
    });
  }, [markAllDrawnMutation, participants]);

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
