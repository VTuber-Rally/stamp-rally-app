import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
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
  maxRandomClassicCards: number;
}

export function InventoryPage({
  maxClassicCards,
  maxHoloCards,
  maxRandomClassicCards,
}: InventoryPageProps) {
  const { t } = useTranslation();
  const availableCards = useAvailableCards();

  const { addToCart, cartCards, setLimits, addRandomClassicCards, setOpen } =
    useInventoryDrawerContext();

  const randomAssignedRef = useRef<string | null>(null);

  useEffect(() => {
    setLimits({
      maxClassicCards,
      maxHoloCards,
      maxRandomClassicCards,
    });
  }, [setLimits, maxClassicCards, maxHoloCards, maxRandomClassicCards]);

  // Auto-assign random classic cards from the available stock once the
  // available cards are loaded. Random cards are picked from designs that
  // still have classic stock, weighted by their remaining stock so designs
  // with more stock are more likely to be picked. The result is added to the
  // cart marked as "random" so it can be distinguished from manually-added
  // cards. This only runs once per (submission, count) pair to avoid
  // re-randomizing on every render.
  const randomAssignedKey = `${maxRandomClassicCards}`;
  useEffect(() => {
    if (availableCards.status !== "success") return;
    if (maxRandomClassicCards <= 0) return;
    if (randomAssignedRef.current === randomAssignedKey) return;

    const designs = availableCards.data.cards.filter((c) => c.classicStock > 0);
    if (designs.length === 0) return;

    const pool: typeof designs = [];
    for (const design of designs) {
      for (let i = 0; i < design.classicStock; i++) {
        pool.push(design);
      }
    }

    const picked: typeof designs = [];
    for (let i = 0; i < maxRandomClassicCards; i++) {
      if (pool.length === 0) break;
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool[idx]);
      // Remove all entries of the picked design from the pool so the same
      // design is not picked twice for the same random draw.
      const pickedId = pool[idx]._id;
      for (let j = pool.length - 1; j >= 0; j--) {
        if (pool[j]._id === pickedId) pool.splice(j, 1);
      }
    }

    if (picked.length > 0) {
      addRandomClassicCards(picked);
      randomAssignedRef.current = randomAssignedKey;
      setOpen(true);
    }
  }, [
    availableCards,
    maxRandomClassicCards,
    addRandomClassicCards,
    randomAssignedKey,
    setOpen,
  ]);

  if (availableCards.status === "pending") {
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

  if (availableCards.status === "error") {
    return (
      <div className="flex grow flex-col">
        <Header>{t("inventory.title")}</Header>
        <div className="flex grow items-center justify-center">
          <p className="text-red-500">
            {t("error")}: {availableCards.error.message}
          </p>
        </div>
      </div>
    );
  }

  const { cards: cardDesignWithStock, activeGroup: group } =
    availableCards.data;

  return (
    <div className="flex grow flex-col pb-12">
      <Header>{t("inventory.title")}</Header>

      {group && (
        <GroupInfo
          group={group}
          maxClassicCards={maxClassicCards}
          maxHoloCards={maxHoloCards}
          maxRandomClassicCards={maxRandomClassicCards}
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

      <div className="fixed right-0 bottom-[calc(4rem+env(safe-area-inset-bottom,20px))] left-0 z-40 mx-auto flex max-w-lg">
        <InventoryCartBar />
      </div>
    </div>
  );
}
