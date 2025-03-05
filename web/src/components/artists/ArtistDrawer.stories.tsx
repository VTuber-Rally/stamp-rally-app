import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { RouterDecorator, TanStackQueryDecorator } from "@/lib/decorators.tsx";
import { handlers } from "@/msw.ts";

import { ArtistDrawer } from "./ArtistDrawer.tsx";

const meta = {
  title: "Rallyist/ArtistDrawer",
  component: ArtistDrawer,
  decorators: [TanStackQueryDecorator, RouterDecorator],
  parameters: {
    msw: {
      handlers,
    },
  },
} satisfies Meta<typeof ArtistDrawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  argTypes: {
    open: {
      control: {
        type: "boolean",
      },
    },
    activeStandistId: {
      control: {
        type: "text",
      },
    },
  },
  args: {
    open: true,
    setOpen: fn,
    activeStandistId: "66873ba100357c59f3bf",
  },
};
