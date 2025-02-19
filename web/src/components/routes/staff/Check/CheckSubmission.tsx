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
import { databaseId, submissionsCollectionId } from "@/lib/consts.ts";
import { useRallySubmission } from "@/lib/hooks/useRallySubmission.ts";
import { useToast } from "@/lib/hooks/useToast.ts";
import { queryClient } from "@/lib/queryClient.ts";

const CheckSubmission = ({ submissionId }: { submissionId: string }) => {
  const { data, isLoading } = useRallySubmission(submissionId);
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

    await navigate({ to: "/staff/wheel" });
  };

  if (isLoading) {
    return (
      <div className={"flex flex-col items-center"}>
        <Loader size={4} />
        <h1>{t("loading")}</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={"flex flex-col items-center"}>
        <h1>Submission not found</h1>
      </div>
    );
  }

  const submissionInterval = () => {
    const submittedAt = new Date(data.submitted);

    const now = new Date();

    return formatDistance(submittedAt, now, {
      locale: currentLanguage.includes("fr") ? fr : undefined,
      addSuffix: true,
    });
  };

  return (
    <>
      <Header>{t("submission", { id: submissionId })}</Header>
      <div className="flex grow flex-col items-center justify-center">
        {data.redeemed && (
          <div className="flex flex-col items-center justify-center rounded-xl bg-red-300 p-4">
            <h1 className={"flex text-2xl font-bold"}>
              <TriangleAlert size={32} className={"mr-2"} />
              Attention: déjà récupéré !
            </h1>
          </div>
        )}

        <h2 className={"text-2xl"}>
          {t("submittedAgo", { time: submissionInterval() })}
        </h2>

        <Table>
          <TableCaption>{data.stamps.length} stamps</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>⏱ ⚡</TableHead>
              <TableHead>⏱&nbsp;📲&nbsp;⏮️</TableHead>
              <TableHead className="text-right">Stand</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.stamps.map((stamp, i) => (
              <TableRow key={stamp.$id}>
                <TableCell>
                  {new Date(stamp.scanned).getTime() -
                    new Date(stamp.generated).getTime()}
                  &nbsp;ms
                </TableCell>
                <TableCell>
                  <div className={"flex"}>
                    {i !== 0 && (
                      <SymbolIndicator
                        date1={stamp.scanned}
                        date2={data.stamps[i - 1].scanned}
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {stamp.standist.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <ButtonLink
          type={"button"}
          size={"big"}
          disabled={data.redeemed}
          onClick={() => markAsRedeemed(submissionId)}
        >
          Valider et aller vers la roue de la fortune !
        </ButtonLink>
      </div>
    </>
  );
};

interface SymbolIndicatorProps {
  date1: string;
  date2: string;
}

const calculateDifference = (date1: string, date2: string) => {
  const diff = new Date(date1).getTime() - new Date(date2).getTime();

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

  const diff = new Date(date1).getTime() - new Date(date2).getTime();
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
