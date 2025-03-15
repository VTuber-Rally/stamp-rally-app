import { KeyValueEntry } from "./models/KeyValue";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const KEY_VALUES: Record<string, KeyValueEntry<any>> = {
  eventEndDate: {
    key: "eventEndDate",
    transform: (value: string) => new Date(value),
  },
} as const;
