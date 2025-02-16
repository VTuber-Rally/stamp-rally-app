import { FC, useCallback, useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { Checkbox } from "@/components/inputs/Checkbox.tsx";

export const AnalyticsOptOut: FC = () => {
  const { t } = useTranslation();

  const [optedOut, setOptedOutState] = useState(
    window.localStorage.getItem("plausible_ignore") === "true",
  );

  const id = useId();

  const setOptedOut = useCallback(
    (optOut: boolean) => {
      window.localStorage.setItem("plausible_ignore", optOut ? "true" : "");
      setOptedOutState(optOut);
    },
    [setOptedOutState],
  );

  const onChange = useCallback(
    (value: boolean | "indeterminate") => {
      if (typeof value === "boolean") setOptedOut(value);
    },
    [setOptedOut],
  );

  return (
    <div className="flex items-start">
      <Checkbox id={id} checked={optedOut} onCheckedChange={onChange} />
      <label className="select-none" htmlFor={id}>
        {t("analyticsOptOut.optOut")}
      </label>
    </div>
  );
};
