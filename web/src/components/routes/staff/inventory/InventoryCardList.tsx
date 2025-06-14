import { useTranslation } from "react-i18next";

import { CardAvailable } from "@vtube-stamp-rally/shared-lib/models/Inventory.ts";

import type { CartCard } from "@/contexts/InventoryDrawerContext.ts";

import { InventoryCard } from "./InventoryCard.tsx";

interface InventoryCardListProps {
  cardDesignWithStock: CardAvailable[];
  cartCards: CartCard[];
  addToCart: (card: CardAvailable, type: "classic" | "holo") => void;
}

export function InventoryCardList({
  cardDesignWithStock,
  cartCards,
  addToCart,
}: InventoryCardListProps) {
  const { t } = useTranslation();

  return (
    <>
      <p className="mb-4 text-xs text-gray-500 italic">
        {t("inventory.cardList.description")}
      </p>

      <div className="grid grid-cols-2 gap-4">
        {cardDesignWithStock.map((design) => {
          const cartCard = cartCards.find((card) => card.$id === design.$id);
          return (
            <InventoryCard
              key={design.$id}
              design={design}
              cartCard={cartCard}
              addToCart={addToCart}
            />
          );
        })}
      </div>
    </>
  );
}
