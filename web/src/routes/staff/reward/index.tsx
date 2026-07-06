import { createFileRoute } from "@tanstack/react-router";

import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import { Header } from "@/components/layout/Header.tsx";

export const Route = createFileRoute("/staff/reward/")({
  component: RewardPage,
});

function RewardPage() {
  return (
    <>
      <Header>Draw rewards</Header>
      <ButtonLink href="/staff/reward/standard" bg="success-orange">
        Standard
      </ButtonLink>
      <p className="pt-2 text-gray-600">
        Rally à 10 tampons, 1 à 2 cartes ou 1 carte holo
      </p>
      <ButtonLink href="/staff/reward/premium" bg="tertiary">
        Premium
      </ButtonLink>
      <p className="pt-2 text-gray-600">
        Rally à 16 tampons, 0 à 5 cartes ou 1 à 2 cartes holo
      </p>
    </>
  );
}
