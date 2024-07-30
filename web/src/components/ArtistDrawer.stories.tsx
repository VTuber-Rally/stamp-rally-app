import type { Meta, StoryObj } from "@storybook/react";

import { ArtistDrawer } from "./ArtistDrawer";
import { RouterDecorator, TanStackQueryDecorator } from "@/lib/decorators.tsx";
import { fn } from "@storybook/test";

const meta = {
  title: "Rallyist/ArtistDrawer",
  component: ArtistDrawer,
  decorators: [TanStackQueryDecorator, RouterDecorator],
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
