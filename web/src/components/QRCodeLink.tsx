import { ButtonLink } from "./ButtonLink.tsx";
import { useTranslation } from "react-i18next";
import { useQRDrawerContext } from "@/context/useQRDrawerContext";

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
