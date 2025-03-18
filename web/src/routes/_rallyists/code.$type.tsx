import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_rallyists/code/$type")({
  pendingComponent: CodeLoading,
  errorComponent: CodeError,
  gcTime: 0,
  loader: async ({ location: { hash }, params: { type } }) => {
    if (!hash) throw new TypeError("No hash provided");

    switch (type) {
      case "c":
        throw redirect({
          to: "/", // TODO: à remplacer par la route du concours rallyiste
          hash: hash,
        });

      case "s":
        throw redirect({
          to: "/stamp",
          hash: hash,
        });

      default:
        throw new Error(`Unknown QR code type: ${type}`);
    }
  },
});

function CodeLoading() {
  const { t } = useTranslation();
  return t("loadingQRData");
}

function CodeError({ error }: { error: Error }) {
  const { t } = useTranslation();

  return (
    <div>
      <p>{t("QRCodeValidationError.title")}</p>
      <p>
        <em>{t("QRCodeValidationError.tip")}</em>
      </p>
      <details className="overflow-x-auto">
        <summary>{t("QRCodeValidationError.details")}</summary>
        <pre>{error.stack}</pre>
      </details>
    </div>
  );
}
