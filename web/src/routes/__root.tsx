import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ToastViewport.tsx";
import { QRCodeDrawer } from "@/components/QRCodeDrawer.tsx";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <>
      <ScrollRestoration />
      <div
        className={
          "flex flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom,20px))] min-h-dvh overflow-x-auto p-4"
        }
      >
        <Outlet />
      </div>
      <Toaster />
      <QRCodeDrawer />
    </>
  );
}
