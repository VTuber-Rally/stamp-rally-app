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
      <p className="pt-2 text-gray-600">Rally à 10 tampons, 1 à 3 cartes</p>
      <ButtonLink href="/staff/reward/premium" bg="tertiary">
        Premium
      </ButtonLink>
      <p className="pt-2 text-gray-600">
        Rally à 16 tampons, 0 à 3 cartes ou 1 carte holo
      </p>
    </>
  );
}
