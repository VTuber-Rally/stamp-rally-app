import { useNavigate } from "@tanstack/react-router";
import { formatDistance, formatDuration, intervalToDuration } from "date-fns";
import { fr } from "date-fns/locale";
import { TriangleAlert } from "lucide-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import Loader from "@/components/Loader.tsx";
import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import { Header } from "@/components/layout/Header.tsx";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/layout/Table.tsx";
import { QUERY_KEYS } from "@/lib/QueryKeys.ts";
import { databases } from "@/lib/appwrite.ts";
import {
  databaseId,
  premiumRewardMinStampsRequirement,
  submissionsCollectionId,
} from "@/lib/consts.ts";
import { ConvexId } from "@/lib/convex.ts";
import { useBooths } from "@/lib/hooks/useBooths.ts";
import { useRallySubmission } from "@/lib/hooks/useRallySubmission.ts";
import { useToast } from "@/lib/hooks/useToast.ts";
import { queryClient } from "@/lib/queryClient.ts";

const CheckSubmission = ({ submissionId }: { submissionId: string }) => {
  const { data: booths } = useBooths();
  const submission = useRallySubmission(
    submissionId as ConvexId<"submissions">,
  );
  const navigate = useNavigate();
  const { t } = useTranslation();

  // get current language from i18next
  const i18n = useTranslation();
  const currentLanguage = i18n.i18n.language;

  const markAsRedeemed = async (submissionId: string) => {
    await databases.updateDocument(
      databaseId,
      submissionsCollectionId,
      submissionId,
      {
        redeemed: true,
      },
    );

    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.SUBMISSION, submissionId],
    });

    await navigate({
      to: "/staff/reward/$drawType",
      params: {
        drawType:
          (submission?.stampsCount ?? 0) >= premiumRewardMinStampsRequirement
            ? "premium"
            : "standard",
      },
      search: {
        submissionId,
      },
    });
  };

  if (typeof submission === "undefined") {
    return (
      <div className={"flex flex-col items-center"}>
        <Loader size={4} />
        <h1>{t("loading")}</h1>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className={"flex flex-col items-center"}>
        <h1>Submission not found</h1>
      </div>
    );
  }

  const submittedAt = new Date(submission._creationTime);

  const now = new Date();

  const submissionInterval = formatDistance(submittedAt, now, {
    locale: currentLanguage.includes("fr") ? fr : undefined,
    addSuffix: true,
  });

  return (
    <>
      <Header>{t("submission", { id: submissionId.slice(-10) })}</Header>
      <div className="flex grow flex-col items-center justify-center">
        {submission.redeemed && (
          <div className="flex flex-col items-center justify-center rounded-xl bg-red-300 p-4">
            <h1 className={"flex text-2xl font-bold"}>
              <TriangleAlert size={32} className={"mr-2"} />
              Attention: déjà récupéré !
            </h1>
          </div>
        )}

        <h2 className={"text-2xl"}>
          {t("submittedAgo", { time: submissionInterval })}
        </h2>

        <Table>
          <TableCaption>{submission.stampsCount} stamps</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>⏱&nbsp;📲&nbsp;⏮️</TableHead>
              <TableHead className="text-right">Stand</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submission.stamps.map((stamp, i, stamps) => (
              <TableRow key={stamp._id}>
                <TableCell>
                  <div className={"flex"}>
                    {i !== 0 && (
                      <SymbolIndicator
                        date1={stamp.scannedAt}
                        date2={stamps[i - 1].scannedAt}
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {booths?.find((booth) => booth._id === stamp.booth)?.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <ButtonLink
          type={"button"}
          size={"big"}
          disabled={submission.redeemed}
          onClick={() => markAsRedeemed(submissionId)}
        >
          Valider et passer au reward
        </ButtonLink>
      </div>
    </>
  );
};

interface SymbolIndicatorProps {
  date1: number;
  date2: number;
}

const calculateDifference = (date1: number, date2: number) => {
  const diff = date2 - date1;

  const duration = intervalToDuration({ start: 0, end: diff });

  return formatDuration(duration, {
    format: ["hours", "minutes", "seconds"],
    delimiter: ", ",
    zero: false,
  })
    .replace(" hours", "h")
    .replace(" minutes", "min")
    .replace(" seconds", "s");
};

const SymbolIndicator: FC<SymbolIndicatorProps> = ({ date1, date2 }) => {
  const { toast } = useToast();

  const diff = date2 - date1;
  const diffString = calculateDifference(date1, date2);

  const showTime = () => {
    toast({
      title: new Date(date1).toLocaleString(),
      description: `Scan précédent: ${new Date(date2).toLocaleString()}`,
    });
  };

  // 2 minutes
  if (diff < 120000) {
    return (
      <div className={"flex rounded-xl bg-red-200 p-2"} onClick={showTime}>
        <TriangleAlert size={20} className={"mr-1"} />
        {diffString}
      </div>
    );
  }

  // 5 minutes
  if (diff < 300000) {
    return (
      <div className={"flex rounded-xl bg-orange-300 p-2"} onClick={showTime}>
        <TriangleAlert size={20} className={"mr-1"} />
        {diffString}
      </div>
    );
  }

  return diffString;
};

export default CheckSubmission;
