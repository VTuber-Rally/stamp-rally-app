import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { InventoryCartBar } from "@/components/inventory/InventoryCartBar";
import { Header } from "@/components/layout/Header";
import { useInventoryDrawerContext } from "@/contexts/useInventoryDrawerContext";
import { useAvailableCards } from "@/lib/hooks/inventory/useAvailableCards.ts";

import { GroupInfo } from "./GroupInfo.tsx";
import { InventoryCardList } from "./InventoryCardList.tsx";

interface InventoryPageProps {
  maxClassicCards: number;
  maxHoloCards: number;
}

export function InventoryPage({
  maxClassicCards,
  maxHoloCards,
}: InventoryPageProps) {
  const { t } = useTranslation();
  const {
    data: { cards: cardDesignWithStock, group } = {},
    isLoading,
    error,
  } = useAvailableCards();

  const { addToCart, cartCards, setLimits } = useInventoryDrawerContext();

  useEffect(() => {
    setLimits({
      maxClassicCards,
      maxHoloCards,
    });
  }, [setLimits, maxClassicCards, maxHoloCards]);

  if (isLoading) {
    return (
      <div className="flex grow flex-col">
        <Header>{t("inventory.title")}</Header>
        <div className="flex grow flex-col items-center justify-center gap-2">
          <Loader2 className="h-12 w-12 animate-spin" />
          <p className="text-gray-500">{t("inventory.loading")}</p>
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
    <div className="flex grow flex-col pb-12">
      <Header>{t("inventory.title")}</Header>

      {group && (
        <GroupInfo
          group={group}
          maxClassicCards={maxClassicCards}
          maxHoloCards={maxHoloCards}
        />
      )}

      <div className="p-4">
        {cardDesignWithStock && cardDesignWithStock.length > 0 ? (
          <InventoryCardList
            cardDesignWithStock={cardDesignWithStock}
            cartCards={cartCards}
            addToCart={addToCart}
          />
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">{t("cardDesigns.noCardsFound")}</p>
          </div>
        )}
      </div>

      <div className="fixed right-0 bottom-16 left-0 z-40 mx-auto flex max-w-lg">
        <InventoryCartBar />
      </div>
    </div>
  );
}
