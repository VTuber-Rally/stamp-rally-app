import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from "@tanstack/react-router";

import { QRCodeDrawer } from "@/components/scan/QRCodeDrawer.tsx";
import { Toaster } from "@/components/toasts/Toaster.tsx";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <>
      <ScrollRestoration />
      <div
        className={
          "flex min-h-dvh flex-col overflow-x-auto p-4 pb-[calc(4.5rem+env(safe-area-inset-bottom,20px))]"
        }
      >
        <Outlet />
      </div>
      <Toaster />
      <QRCodeDrawer />
    </>
  );
}
