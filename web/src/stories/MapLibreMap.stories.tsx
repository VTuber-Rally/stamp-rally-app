import type { Meta, StoryObj } from "@storybook/react";

import { RouterDecorator } from "@/lib/decorators.tsx";

import { MapLibreMap } from "../components/MapLibreMap.tsx";

const meta = {
  title: "Rallyist/MapLibreMap",
  component: MapLibreMap,
  decorators: [RouterDecorator],
  argTypes: {
    onStandClick: { action: "standClick" },
  },
  args: {
    onStandClick: () => {},
  },
} satisfies Meta<typeof MapLibreMap>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
