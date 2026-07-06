import { FC, PropsWithChildren, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  CartCard,
  InventoryDrawerContext,
  InventoryDrawerContextType,
} from "@/contexts/InventoryDrawerContext";
import { CardDesign } from "@/lib/convex.ts";
import { useToast } from "@/lib/hooks/useToast.ts";

export const InventoryDrawerContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [cartCards, setCartCards] = useState<CartCard[]>([]);
  const [limits, setLimits] = useState({
    maxClassicCards: 3,
    maxHoloCards: 3,
    maxRandomClassicCards: 0,
  });
  const { toast } = useToast();
  const { t } = useTranslation();

  const setLimitsCallback = useCallback(
    (newLimits: {
      maxClassicCards: number;
      maxHoloCards: number;
      maxRandomClassicCards: number;
    }) => {
      setLimits(newLimits);
    },
    [],
  );

  const addToCart = useCallback(
    (card: CardDesign, type: "classic" | "holo") => {
      const totalInCart = cartCards.reduce(
        (sum, i) =>
          sum + (type === "classic" ? i.classicQuantity : i.holoQuantity),
        0,
      );
      const limit =
        type === "classic" ? limits.maxClassicCards : limits.maxHoloCards;

      if (totalInCart >= limit) {
        toast({
          title: t("inventory.cart.limitReached.title"),
          description: t(
            type === "classic"
              ? "inventory.cart.limitReached.classic_description"
              : "inventory.cart.limitReached.holo_description",
            { count: limit },
          ),
        });
        return;
      }

      setCartCards((prev) => {
        const existingCardIndex = prev.findIndex(
          (cartCard) => cartCard._id === card._id,
        );

        if (existingCardIndex >= 0) {
          const updatedCards = [...prev];
          const existingCard = updatedCards[existingCardIndex];

          if (type === "classic") {
            updatedCards[existingCardIndex] = {
              ...existingCard,
              classicQuantity: existingCard.classicQuantity + 1,
            };
          } else {
            updatedCards[existingCardIndex] = {
              ...existingCard,
              holoQuantity: existingCard.holoQuantity + 1,
            };
          }

          return updatedCards;
        } else {
          const newCard: CartCard = {
            ...card,
            classicQuantity: type === "classic" ? 1 : 0,
            holoQuantity: type === "holo" ? 1 : 0,
            randomClassicQuantity: 0,
          };
          return [...prev, newCard];
        }
      });
    },
    [cartCards, limits, t, toast],
  );

  const addRandomClassicCards = useCallback((cards: CardDesign[]) => {
    if (cards.length === 0) return;
    setCartCards((prev) => {
      const next = [...prev];
      for (const card of cards) {
        const existingCardIndex = next.findIndex(
          (cartCard) => cartCard._id === card._id,
        );
        if (existingCardIndex >= 0) {
          const existingCard = next[existingCardIndex];
          next[existingCardIndex] = {
            ...existingCard,
            randomClassicQuantity: existingCard.randomClassicQuantity + 1,
          };
        } else {
          const newCard: CartCard = {
            ...card,
            classicQuantity: 0,
            holoQuantity: 0,
            randomClassicQuantity: 1,
          };
          next.push(newCard);
        }
      }
      return next;
    });
  }, []);

  const removeFromCart = useCallback(
    (cardId: string, type: "classic" | "holo") => {
      setCartCards((prev) => {
        return prev
          .map((card) => {
            if (card._id === cardId) {
              const updatedCard = { ...card };

              if (type === "classic") {
                updatedCard.classicQuantity = Math.max(
                  0,
                  updatedCard.classicQuantity - 1,
                );
              } else {
                updatedCard.holoQuantity = Math.max(
                  0,
                  updatedCard.holoQuantity - 1,
                );
              }

              return updatedCard;
            }
            return card;
          })
          .filter(
            (card) =>
              card.classicQuantity > 0 ||
              card.holoQuantity > 0 ||
              card.randomClassicQuantity > 0,
          );
      });
    },
    [],
  );

  const clearCart = useCallback((force = false) => {
    if (force) {
      setCartCards([]);
    } else {
      setCartCards((prev) => {
        const newArr: CartCard[] = [];
        for (const cartCard of prev) {
          if (cartCard.randomClassicQuantity > 0) {
            newArr.push({
              ...cartCard,
              classicQuantity: 0,
              holoQuantity: 0,
            });
          }
        }
        return newArr;
      });
    }
  }, []);

  const contextValue = useMemo<InventoryDrawerContextType>(
    () => ({
      open,
      setOpen,
      cartCards,
      setCartCards,
      addToCart,
      removeFromCart,
      addRandomClassicCards,
      clearCart,
      maxClassicCards: limits.maxClassicCards,
      maxHoloCards: limits.maxHoloCards,
      maxRandomClassicCards: limits.maxRandomClassicCards,
      setLimits: setLimitsCallback,
    }),
    [
      open,
      cartCards,
      addToCart,
      removeFromCart,
      addRandomClassicCards,
      clearCart,
      limits.maxClassicCards,
      limits.maxHoloCards,
      limits.maxRandomClassicCards,
      setLimitsCallback,
    ],
  );

  return (
    <InventoryDrawerContext.Provider value={contextValue}>
      {children}
    </InventoryDrawerContext.Provider>
  );
};
