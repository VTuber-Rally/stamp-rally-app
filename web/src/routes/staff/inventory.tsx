import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Loader from "@/components/Loader.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { useAvailableCards } from "@/lib/hooks/useAvailableCards.ts";
import { useCardDesignsPreview } from "@/lib/hooks/useCardDesigns.ts";

export const Route = createFileRoute("/staff/inventory")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const {
    data: cardDesigns,
    isLoading: isLoadingDesigns,
    error: errorDesigns,
  } = useCardDesignsPreview(128, 192);
  const {
    data: availableCards,
    isLoading: isLoadingCards,
    error: errorCards,
  } = useAvailableCards();

  const isLoading = isLoadingDesigns || isLoadingCards;
  const error = errorDesigns || errorCards;

  // #optimisation tavu
  const stockPerDesign = useMemo(() => {
    if (!availableCards?.cards) return {};
    return availableCards.cards.reduce(
      (acc, card) => {
        acc[card.cardDesign.$id] = (acc[card.cardDesign.$id] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [availableCards]);

  if (isLoading) {
    return (
      <div className="flex grow flex-col">
        <Header>{t("inventory.title")}</Header>
        <div className="flex grow items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex grow flex-col">
        <Header>{t("inventory.title")}</Header>
        <div className="flex grow items-center justify-center">
          <p className="text-red-500">
            {t("error")}: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex grow flex-col">
      <Header>{t("inventory.title")}</Header>

      {availableCards?.group && (
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {t("inventory.group", { groupId: availableCards.group.groupId })}
            </h2>
            <p className="text-sm text-gray-600">
              {t("inventory.groupDates", {
                start: new Date(availableCards.group.start).toLocaleString(),
                end: new Date(availableCards.group.end).toLocaleString(),
              })}
            </p>
            <p className="text-xs text-gray-500">
              {t("inventory.groupInfo", {
                numberOfCards: availableCards.group.numberOfCardsPerDesign,
                coefficient: availableCards.group.coefficient.toFixed(2),
              })}
            </p>
          </div>
        </div>
      )}

      <div className="p-4">
        {cardDesigns && cardDesigns.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cardDesigns.map((design) => (
              <div
                key={design.$id}
                className="rounded-lg border border-gray-200 bg-white p-2 shadow-md"
              >
                <div className="flex flex-col items-center">
                  <img
                    src={design.image || ""}
                    alt={design.name || "Card design"}
                    className="mb-3 rounded-lg object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {design.name || "Sans nom"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t("cardDesigns.byAuthor", {
                      author: design.author || t("cardDesigns.unknownAuthor"),
                    })}
                  </p>
                  {design.standist &&
                    design.standist.name !== design.author && (
                      <p className="mt-2 text-xs text-gray-500">
                        {t("cardDesigns.stand", {
                          standName: design.standist.name,
                        })}
                      </p>
                    )}

                  <div className="mt-3 rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {t("inventory.stock")}
                      </span>{" "}
                      <span
                        className={clsx(
                          "text-sm font-bold",
                          stockPerDesign[design.$id] > 0
                            ? "text-green-600"
                            : "text-red-600",
                        )}
                      >
                        &nbsp;{stockPerDesign[design.$id]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">{t("cardDesigns.noCardsFound")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
