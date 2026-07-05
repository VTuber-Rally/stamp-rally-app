import { useTranslation } from "react-i18next";

import type { CartCard } from "@/contexts/InventoryDrawerContext.ts";
import { CardDesign, CardDesignWithAvailability } from "@/lib/convex.ts";

import { InventoryCard } from "./InventoryCard.tsx";

interface InventoryCardListProps {
  cardDesignWithStock: CardDesignWithAvailability[];
  cartCards: CartCard[];
  addToCart: (card: CardDesign, type: "classic" | "holo") => void;
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
          const cartCard = cartCards.find((card) => card._id === design._id);
          return (
            <InventoryCard
              key={design._id}
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
