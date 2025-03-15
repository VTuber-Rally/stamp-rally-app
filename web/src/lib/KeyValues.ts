import { KeyValueEntry } from "./models/KeyValue";

export const KEY_VALUES = {
  eventEndDate: {
    key: "eventEndDate",
    transform: (value: string) => new Date(value),
  } satisfies KeyValueEntry<Date>,
} as const satisfies Record<string, KeyValueEntry<unknown>>;
