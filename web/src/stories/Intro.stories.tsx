import type { Meta, StoryObj } from "@storybook/react";

import Intro from "../components/Intro.tsx";

const meta = {
  title: "Rallyist/Intro",
  component: Intro,
} satisfies Meta<typeof Intro>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
