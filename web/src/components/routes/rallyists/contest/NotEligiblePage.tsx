import { useTranslation } from "react-i18next";

import { ButtonLink } from "@/components/controls/ButtonLink";
import { Header } from "@/components/layout/Header";

export function NotEligiblePage() {
  const { t } = useTranslation();

  return (
    <>
      <Header className="text-red-600">{t("contest.notEligible.title")}</Header>

      <p className="mb-3 text-lg font-semibold">
        {t("contest.notEligible.description")}
      </p>

      <hr className={"mb-4"} />

      <div className={"mb-4"}>
        <h2 className="text-lg font-semibold">
          {t("contest.notEligible.requirements.title")}
        </h2>
        <p>{t("contest.notEligible.requirements.submissions")}</p>
      </div>

      <div className="mb-2">
        <h2 className="mb-2 text-lg font-semibold">
          {t("contest.notEligible.whatToDo.title")}
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>{t("contest.notEligible.whatToDo.step1")}</li>
          <li>{t("contest.notEligible.whatToDo.step2")}</li>
        </ul>
      </div>

      <ButtonLink href="/artists" type="link" size="medium">
        {t("artistList")}
      </ButtonLink>
    </>
  );
}
