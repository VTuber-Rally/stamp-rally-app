import clsx from "clsx";
import { Sparkles, Vote } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

import { CardAvailable } from "@vtube-stamp-rally/shared-lib/models/Inventory.ts";

import type { CartCard } from "@/contexts/InventoryDrawerContext.ts";
import { useToast } from "@/lib/hooks/useToast.ts";

interface InventoryCardProps {
  design: CardAvailable;
  cartCard: CartCard | undefined;
  addToCart: (card: CardAvailable, type: "classic" | "holo") => void;
}

export function InventoryCard({
  design,
  cartCard,
  addToCart,
}: InventoryCardProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const hasClassic = !!cartCard && cartCard.classicQuantity > 0;
  const hasHolo = !!cartCard && cartCard.holoQuantity > 0;

  const handleStockClick = (type: "classic" | "holo") => {
    const currentQuantity =
      type === "classic"
        ? (cartCard?.classicQuantity ?? 0)
        : (cartCard?.holoQuantity ?? 0);
    const stockLimit =
      type === "classic" ? design.classicStock : design.holoStock;

    if (currentQuantity >= stockLimit) {
      toast({
        title: t("inventory.cart.stockLimit.title"),
        description: t("inventory.cart.stockLimit.description"),
      });
      return;
    }
    addToCart(design, type);
  };

  const StockDisplay = ({
    count,
    i18nKey,
  }: {
    count: number;
    i18nKey: string;
  }) => {
    const isStockAvailable = count > 0;
    return (
      <Trans
        t={t}
        i18nKey={i18nKey}
        values={{
          count,
        }}
        components={{
          1: (
            <span
              className={clsx(
                "text-lg font-bold",
                isStockAvailable ? "text-green-600" : "text-red-600",
              )}
            />
          ),
        }}
      />
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-md">
      <div className="flex flex-col items-center">
        <img
          src={design.image}
          alt={design.name}
          className="mb-3 rounded-lg object-cover"
        />

        <h3 className="text-lg font-semibold text-gray-800">{design.name}</h3>
        <p className="text-sm text-gray-600">
          {t("cardDesigns.byAuthor", {
            author: design.author,
          })}
        </p>
        {design.standist && design.standist.name !== design.author && (
          <p className="mt-2 text-xs text-gray-500">
            {t("cardDesigns.stand", {
              standName: design.standist.name,
            })}
          </p>
        )}

        <div className="mt-3 w-full space-y-2">
          {/* Stock classique */}
          <div
            className="flex cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-lg shadow-md"
            onClick={() => handleStockClick("classic")}
          >
            <StockDisplay
              count={design.classicStock}
              i18nKey={"inventory.stock.classic"}
            />
            {hasClassic && (
              <span className="ml-1 text-base text-green-600">
                {Array.from({
                  length: cartCard?.classicQuantity ?? 0,
                }).map((_, i) => (
                  <Vote key={i} className="inline-block" />
                ))}
              </span>
            )}
          </div>

          {/* Stock holo */}
          <div
            className="flex cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-amber-50 px-3 py-2 text-lg shadow-md"
            onClick={() => handleStockClick("holo")}
          >
            <StockDisplay
              count={design.holoStock}
              i18nKey={"inventory.stock.holo"}
            />
            {hasHolo && (
              <span className="ml-1 text-base text-yellow-500">
                {Array.from({
                  length: cartCard?.holoQuantity ?? 0,
                }).map((_, i) => (
                  <Sparkles key={i} className="inline-block" />
                ))}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
