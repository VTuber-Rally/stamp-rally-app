import type { Meta, StoryObj } from "@storybook/react";

import QrCodeGen from "./QRCodeGen";
import { RouterDecorator, TanStackQueryDecorator } from "@/lib/decorators.tsx";
import { http, HttpResponse } from "msw";
import { GetPrivateKeyExecutionReturn } from "@/stubs/User.ts";
import { handlers } from "@/msw.ts";

const meta = {
  title: "routes/staff/QRCodeGen/QRCodeGen",
  component: QrCodeGen,
  decorators: [RouterDecorator, TanStackQueryDecorator],
  args: {
    userId: "66873ba100357c59f3bf",
  },
  parameters: {
    msw: {
      handlers: [
        ...handlers,
        http.post(
          "https://cloud.appwrite.io/v1/functions/GET_PRIVATE_KEY_FUNCTION_ID/executions",
          () => HttpResponse.json(GetPrivateKeyExecutionReturn),
        ),
      ],
    },
  },
} satisfies Meta<typeof QrCodeGen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};