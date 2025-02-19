import { useTranslation } from "react-i18next";

import { useQRDrawerContext } from "@/contexts/useQRDrawerContext.ts";

import { ButtonLink } from "./ButtonLink.tsx";

const QRCodeLink = () => {
  const [, setQRCodeDrawerOpen] = useQRDrawerContext();
  const { t } = useTranslation();
  return (
    <ButtonLink
      type="button"
      onClick={() => setQRCodeDrawerOpen(true)}
      children={t("scanQRCode")}
      bg="tertiary"
    />
  );
};

export default QRCodeLink;
