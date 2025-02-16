import { createFileRoute } from "@tanstack/react-router";

import CheckSubmission from "@/components/routes/staff/Check/CheckSubmission.tsx";

export const Route = createFileRoute("/staff/submission/$submissionId")({
  component: CheckSubmissionPage,
});

function CheckSubmissionPage() {
  const { submissionId } = Route.useParams();

  return <CheckSubmission submissionId={submissionId} />;
}
