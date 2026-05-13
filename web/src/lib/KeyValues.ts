export type KeyValueEntry<T> = {
  key: string;
  transform: (value: string) => T;
  public: boolean;
};

export const KEY_VALUES = {
  eventEndDate: {
    key: "eventEndDate",
    transform: (value: string) => new Date(value),
    public: true,
  } satisfies KeyValueEntry<Date>,
  contestRegistrationSecret: {
    key: "contestRegistrationSecret",
    transform: (value: string) => value,
    public: false,
  } satisfies KeyValueEntry<string>,
} as const satisfies Record<string, KeyValueEntry<unknown>>;
