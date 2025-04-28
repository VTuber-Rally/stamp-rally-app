import { type KeyValueEntry } from "shared-lib";

export const KEY_VALUES = {
  eventEndDate: {
    key: "eventEndDate",
    transform: (value: string) => new Date(value),
  } satisfies KeyValueEntry<Date>,
} as const satisfies Record<string, KeyValueEntry<unknown>>;
