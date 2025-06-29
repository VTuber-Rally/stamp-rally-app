import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { useInventoryDrawerContext } from "@/contexts/useInventoryDrawerContext";

export const InventoryCartBar = () => {
  const { t } = useTranslation();
  const { cartCards, setOpen, clearCart } = useInventoryDrawerContext();

  const totalCards = cartCards.reduce(
    (acc, card) => acc + card.classicQuantity + card.holoQuantity,
    0,
  );

  return (
    <div
      className={clsx(
        "flex w-full cursor-pointer items-center justify-between rounded-t-lg bg-blue-600 px-4 py-3 text-white shadow-lg transition-all duration-400 ease-in-out",
        totalCards === 0
          ? "translate-y-full opacity-0"
          : "translate-y-0 opacity-100",
      )}
      onClick={() => setOpen(true)}
      role="button"
    >
      <span className="font-semibold">
        {t("inventory.cart.description", { count: totalCards })}
      </span>
      <div className={"flex"}>
        <span className="ml-4 rounded bg-white/20 px-3 py-1 text-sm font-bold">
          {t("inventory.cart.open")}
        </span>
        <div
          className="ml-4 rounded bg-red-700 px-3 py-1 text-sm font-bold text-white"
          onClick={(e) => {
            e.stopPropagation();
            clearCart();
          }}
        >
          {t("inventory.cart.clearShort")}
        </div>
      </div>
    </div>
  );
};
