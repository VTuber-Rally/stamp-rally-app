import type { Meta, StoryObj } from "@storybook/react";

import {
  DialogDecorator,
  RouterDecorator,
  TanStackQueryDecorator,
} from "@/lib/decorators.tsx";

import { ArtistPresentation } from "./ArtistPresentation.tsx";

const meta = {
  title: "Rallyist/ArtistPresentation",
  component: ArtistPresentation,
  decorators: [TanStackQueryDecorator, RouterDecorator, DialogDecorator],
  args: {
    artistId: "66873ba100357c59f3bf",
  },
} satisfies Meta<typeof ArtistPresentation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
