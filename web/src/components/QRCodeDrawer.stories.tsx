import type { Meta, StoryObj } from "@storybook/react";

import { useQRDrawerContext } from "@/context/useQRDrawerContext.ts";
import {
  QRDrawerContextProviderDecorator,
  RouterDecorator,
} from "@/lib/decorators.tsx";

import { QRCodeDrawer } from "./QRCodeDrawer";

const Template = () => {
  const [open, setOpen] = useQRDrawerContext();
  return (
    <>
      {!open && <button onClick={() => setOpen(true)}>Open QR Drawer</button>}
    </>
  );
};

const meta = {
  title: "Rallyist/QRCodeDrawer",
  component: QRCodeDrawer,
  decorators: [RouterDecorator, QRDrawerContextProviderDecorator],
  render: Template,
} satisfies Meta<typeof QRCodeDrawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
