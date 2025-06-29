import clsx from "clsx";
import { Loader2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SellCardsFunctionRequest } from "@vtube-stamp-rally/shared-lib/functions/sellCards.ts";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/layout/Drawer.tsx";
import { CartCard } from "@/contexts/InventoryDrawerContext";
import { useInventoryDrawerContext } from "@/contexts/useInventoryDrawerContext.ts";
import { useSellCards } from "@/lib/hooks/inventory/useSellCards.ts";
import { useToast } from "@/lib/hooks/useToast";

import { ButtonLink } from "../controls/ButtonLink";

type CartCardLineProps = {
  card: CartCard;
  totalClassicInCart: number;
  totalHoloInCart: number;
};

function CartCardLine({
  card,
  totalClassicInCart,
  totalHoloInCart,
}: CartCardLineProps) {
  const { t } = useTranslation();
  const { removeFromCart, addToCart, maxClassicCards, maxHoloCards } =
    useInventoryDrawerContext();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start space-x-4">
        <img
          src={card.image || ""}
          alt={card.name || "Card design"}
          className="w-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">
            {card.name || "Sans nom"}
          </h3>
          <p className="text-sm text-gray-600">
            {t("cardDesigns.byAuthor", {
              author: card.author || t("cardDesigns.unknownAuthor"),
            })}
          </p>

          {card.classicQuantity > 0 && (
            <div className="mt-2 flex items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
              <span className="text-sm text-gray-700">
                {t("inventory.cart.classic")}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => removeFromCart(card.$id, "classic")}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center font-semibold">
                  {card.classicQuantity}
                </span>
                <button
                  onClick={() => addToCart(card, "classic")}
                  disabled={
                    card.classicQuantity >= card.classicStock ||
                    totalClassicInCart >= maxClassicCards
                  }
                  className={clsx(
                    "flex h-6 w-6 items-center justify-center rounded-full",
                    card.classicQuantity >= card.classicStock ||
                      totalClassicInCart >= maxClassicCards
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "bg-green-100 text-green-600 hover:bg-green-200",
                  )}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {card.holoQuantity > 0 && (
            <div className="mt-2 flex items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
              <span className="text-sm text-gray-700">
                {t("inventory.cart.holo")}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => removeFromCart(card.$id, "holo")}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center font-semibold">
                  {card.holoQuantity}
                </span>
                <button
                  onClick={() => addToCart(card, "holo")}
                  disabled={
                    card.holoQuantity >= card.holoStock ||
                    totalHoloInCart >= maxHoloCards
                  }
                  className={clsx(
                    "flex h-6 w-6 items-center justify-center rounded-full",
                    card.holoQuantity >= card.holoStock ||
                      totalHoloInCart >= maxHoloCards
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "bg-green-100 text-green-600 hover:bg-green-200",
                  )}
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const InventoryDrawer = ({
  submissionId,
}: {
  submissionId?: string;
}) => {
  const { t } = useTranslation();
  const { open, setOpen, cartCards, clearCart } = useInventoryDrawerContext();

  const { toast } = useToast();

  const { mutate: orderCards, isPending } = useSellCards();

  const handleOrderCards = () => {
    const orderedCards = cartCards.reduce(
      (acc, card) => {
        if (card.classicQuantity > 0) {
          acc.push({
            type: "classic",
            cardDesignId: card.$id,
            quantity: card.classicQuantity,
          });
        }
        if (card.holoQuantity > 0) {
          acc.push({
            type: "holo",
            cardDesignId: card.$id,
            quantity: card.holoQuantity,
          });
        }
        return acc;
      },
      [] as SellCardsFunctionRequest["orderedCards"],
    );

    orderCards(
      { orderedCards, submissionId } satisfies SellCardsFunctionRequest,
      {
        onSuccess: () => {
          toast({
            title: t("inventory.cart.orderSuccess.title"),
            description: t("inventory.cart.orderSuccess.description"),
          });
          clearCart();
        },
        onError: (error) => {
          console.error("Error ordering cards:", error);
          toast({
            title: t("inventory.cart.orderError.title"),
            description: t("inventory.cart.orderError.description"),
          });
        },
      },
    );
  };

  const totalCards = cartCards.reduce(
    (total, card) => total + card.classicQuantity + card.holoQuantity,
    0,
  );
  const totalClassicInCart = cartCards.reduce(
    (sum, card) => sum + card.classicQuantity,
    0,
  );
  const totalHoloInCart = cartCards.reduce(
    (sum, card) => sum + card.holoQuantity,
    0,
  );

  const ClearCartButton = () => (
    <div className="px-4">
      <button
        className="mt-2 flex cursor-pointer text-center text-sm underline disabled:cursor-not-allowed disabled:opacity-50"
        onClick={clearCart}
        disabled={cartCards.length === 0 || isPending}
        title={t("inventory.cart.clear")}
      >
        <Trash2 className="mr-1" size={18} />
        {t("inventory.cart.clear")}
      </button>
    </div>
  );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>{t("inventory.cart.title")}</DrawerTitle>
            <DrawerDescription>
              {totalCards > 0
                ? t("inventory.cart.description", { count: totalCards })
                : t("inventory.cart.empty")}
            </DrawerDescription>
          </DrawerHeader>

          <ClearCartButton />

          <div className="flex-1 overflow-y-auto px-4 pt-4">
            {cartCards.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-500">{t("inventory.cart.noCards")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartCards.map((card) => (
                  <CartCardLine
                    key={card.$id}
                    card={card}
                    totalClassicInCart={totalClassicInCart}
                    totalHoloInCart={totalHoloInCart}
                  />
                ))}
              </div>
            )}
          </div>

          <DrawerFooter>
            <div className="grid gap-2">
              <ButtonLink
                type={"button"}
                size={"medium"}
                disabled={cartCards.length === 0 || isPending}
                onClick={handleOrderCards}
                className="mt-0"
              >
                {isPending ? (
                  <Loader2 className="mr-2 animate-spin" />
                ) : (
                  t("validate")
                )}
              </ButtonLink>

              <DrawerClose asChild>
                <button
                  className="mt-2 text-center text-sm underline disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isPending}
                >
                  {t("close")}
                </button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
