import type { Meta, StoryObj } from "@storybook/react";

import { MapLibreMap } from "./MapLibreMap";
import { fn } from "@storybook/test";
import { RouterDecorator } from "@/lib/decorators.tsx";

const meta = {
  title: "Rallyist/MapLibreMap",
  component: MapLibreMap,
  decorators: [RouterDecorator],
  args: {
    onStandClick: fn(),
  },
} satisfies Meta<typeof MapLibreMap>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};