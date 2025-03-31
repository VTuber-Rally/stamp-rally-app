import { useTranslation } from "react-i18next";

import { useQRDrawerContext } from "@/contexts/useQRDrawerContext.ts";

import { ButtonLink, ButtonLinkProps } from "./ButtonLink.tsx";

const QRCodeLink = ({ size = "big" }: { size?: ButtonLinkProps["size"] }) => {
  const [, setQRCodeDrawerOpen] = useQRDrawerContext();
  const { t } = useTranslation();
  return (
    <ButtonLink
      size={size}
      type="button"
      onClick={() => setQRCodeDrawerOpen(true)}
      children={t("scanQRCode")}
      bg="tertiary"
    />
  );
};

export default QRCodeLink;
