import type { Meta, StoryObj } from '@storybook/react';

import Intro from './Intro';

const meta = {
  component: Intro,
} satisfies Meta<typeof Intro>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};