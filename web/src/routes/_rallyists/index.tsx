import { createFileRoute } from "@tanstack/react-router";

import RallyistsHomepage from "@/components/routes/rallyists/RallyistsHomepage.tsx";
import { useCollectedStamps } from "@/lib/hooks/useCollectedStamps.ts";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions.ts";

export const Route = createFileRoute("/_rallyists/")({
  component: () => Home(),
});

function Home() {
  const stamps = useCollectedStamps();
  const submissions = useRallySubmissions();

  return <RallyistsHomepage stamps={stamps} submissions={submissions} />;
}
