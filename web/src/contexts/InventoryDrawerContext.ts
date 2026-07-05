import { Dispatch, SetStateAction, createContext } from "react";

import { CardDesign } from "@/lib/convex.ts";

export interface CartCard extends CardDesign {
  classicQuantity: number;
  holoQuantity: number;
}

export interface InventoryDrawerContextType {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  cartCards: CartCard[];
  setCartCards: Dispatch<SetStateAction<CartCard[]>>;
  addToCart: (card: CardDesign, type: "classic" | "holo") => void;
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
