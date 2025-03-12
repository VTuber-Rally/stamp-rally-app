import clsx from "clsx";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

import { useContestParticipants } from "@/lib/hooks/useContestParticipants";

export default function Contest() {
  const { data: participants, isLoading, error } = useContestParticipants();
  const handleDrawWinner = async () => {
    // TODO
  };

  const sendNotification = async () => {
    // TODO
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Chargement des participants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-600">
          Erreur lors du chargement des participants
        </div>
      </div>
    );
  }

  if (!participants) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Aucun participant trouvé</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Gestion du Concours Shikishi</h1>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold">QR Code d'inscription</h2>
          <QRCode
            className="rounded-lg border-4 border-tertiary p-2"
            value={`bah faut s'inscrire, duh`}
          />
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Participants (<ParticipantCount count={participants.length} />)
          </h2>
          <ul className="max-h-96 space-y-0.5 overflow-y-auto">
            {participants.map((participant) => (
              <li
                key={participant.$id}
                className="rounded text-gray-700 hover:bg-gray-50"
              >
                {participant.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleDrawWinner}
          className="rounded-lg bg-success-orange px-4 py-2 text-white transition-colors hover:bg-success-orange/80"
        >
          Lancer le tirage au sort
        </button>
        <button
          onClick={sendNotification}
          className="rounded-lg bg-secondary px-4 py-2 text-black transition-colors hover:bg-secondary/80"
        >
          Envoyer une notification
        </button>
      </div>
    </div>
  );
}

function ParticipantCount({ count }: { count: number }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  }, [count]);

  return (
    <span
      className={clsx(
        "transition-colors duration-300",
        isAnimating && "text-success-orange",
      )}
    >
      {count}
    </span>
  );
}
