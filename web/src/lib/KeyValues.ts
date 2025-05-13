import { type KeyValueEntry } from "@vtube-stamp-rally/shared-lib/models/KeyValue.ts";

export const KEY_VALUES = {
  eventEndDate: {
    key: "eventEndDate",
    transform: (value: string) => new Date(value),
  } satisfies KeyValueEntry<Date>,
} as const satisfies Record<string, KeyValueEntry<unknown>>;
