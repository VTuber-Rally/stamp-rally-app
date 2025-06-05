import clsx from "clsx";
import { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import {
  premiumRewardMinStampsRequirement,
  standardRewardMinStampsRequirement,
} from "@/lib/consts.ts";
import { useCollectedStamps } from "@/lib/hooks/useCollectedStamps.ts";

const Marker: FC<{ label: ReactNode }> = ({ label }) => (
  <div className="absolute bottom-full left-1/2 mb-2 flex -translate-x-1/2 transform flex-col items-center">
    <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-lg font-bold text-black">
      {label}
    </div>
    <div className="-mt-1 h-0 w-0 border-t-[12px] border-r-[8px] border-l-[8px] border-t-secondary border-r-transparent border-l-transparent">
      {" "}
    </div>
  </div>
);

type StepStyle = "dot" | "triangle" | "square";
const Step: FC<{
  style?: StepStyle;
  color: string;
  showMarker?: boolean;
  markerLabel?: ReactNode;
}> = ({ style = "dot", color, showMarker = false, markerLabel }) => (
  <div className="relative z-10 flex flex-col items-center">
    {showMarker && <Marker label={markerLabel} />}
    <div
      style={{
        clipPath:
          style === "triangle" ? "polygon(0 100%, 50% 0, 100% 100%)" : "",
      }}
      className={clsx("h-4 w-4", style === "dot" && "rounded-full", color)}
    ></div>
  </div>
);

interface RallyProgressBarProps {
  hideMarker?: boolean;
}

export const RallyProgressBar: FC<RallyProgressBarProps> = ({
  hideMarker = false,
}) => {
  const { t } = useTranslation();
  const { data: stamps } = useCollectedStamps();
  const collectedStamps = stamps?.length ?? 0;

  const steps = Array.from(
    { length: premiumRewardMinStampsRequirement },
    (_, i) => i + 1,
  );

  const progressBarWidth = `calc((100% / ${premiumRewardMinStampsRequirement - 1} * ${Math.max(collectedStamps - 1, 0)}) - 0.5rem)`;

  return (
    <div className={clsx("w-full pb-2", hideMarker ? "pt-2" : "pt-12")}>
      <div className="relative flex w-full items-center justify-between">
        <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 transform bg-gray-400"></div>
        <div
          className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 transform bg-secondary"
          style={{
            width: progressBarWidth,
          }}
        ></div>
        {steps.map((step) => {
          const isOrange = step === standardRewardMinStampsRequirement;
          const isLast = step === premiumRewardMinStampsRequirement;
          const isCurrent = step === collectedStamps;
          const isActivated = step <= collectedStamps;

          let bgColor = "bg-gray-300";
          if (isActivated) bgColor = "bg-secondary";
          if (isOrange) bgColor = "bg-success-orange";
          if (isLast) bgColor = "bg-tertiary";

          let style: StepStyle = "dot";
          if (isOrange) style = "triangle";
          if (isLast) style = "square";

          return (
            <Step
              key={step}
              style={style}
              color={bgColor}
              showMarker={isCurrent && !hideMarker}
              markerLabel={step}
            />
          );
        })}
      </div>
      <p className="pt-2 text-center text-gray-400">
        {t("reward.rally.collectedStamps", { count: collectedStamps })}
      </p>
    </div>
  );
};
