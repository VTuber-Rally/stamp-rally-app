import { Dispatch, SetStateAction, createContext } from "react";

import type { CardAvailable } from "@vtube-stamp-rally/shared-lib/models/Inventory.ts";

export interface CartCard extends CardAvailable {
  classicQuantity: number;
  holoQuantity: number;
}

export interface InventoryDrawerContextType {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  cartCards: CartCard[];
  setCartCards: Dispatch<SetStateAction<CartCard[]>>;
  addToCart: (card: CardAvailable, type: "classic" | "holo") => void;
  removeFromCart: (cardId: string, type: "classic" | "holo") => void;
  clearCart: () => void;
  maxClassicCards: number;
  maxHoloCards: number;
  setLimits: (limits: {
    maxClassicCards: number;
    maxHoloCards: number;
  }) => void;
}

export const InventoryDrawerContext = createContext<InventoryDrawerContextType>(
  {
    open: false,
    setOpen: () => {},
    cartCards: [],
    setCartCards: () => {},
    addToCart: () => {},
    removeFromCart: () => {},
    clearCart: () => {},
    maxClassicCards: 3,
    maxHoloCards: 3,
    setLimits: () => {},
  },
);
