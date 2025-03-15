import type { Meta, StoryObj } from "@storybook/react";
import { Suspense } from "react";

import { TanStackQueryDecorator } from "@/lib/decorators";
import { handlers } from "@/msw";

import { ArtistImage } from "./ArtistImage";

const meta = {
  title: "Rallyist/ArtistImage",
  component: ArtistImage,
  decorators: [TanStackQueryDecorator],
  parameters: {
    msw: {
      handlers,
    },
  },
  render: (args) => (
    <Suspense fallback={<div>Loading...</div>}>
      <ArtistImage {...args} />
    </Suspense>
  ),
} satisfies Meta<typeof ArtistImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    userId: "66873ba100357c59f3bf",
    name: "Kawa-soft",
  },
};

export const InvalidUser: Story = {
  args: {
    userId: "123",
    name: "John Doe",
  },
};
