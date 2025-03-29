type KV = {
  key: string;
  value: string;
};

export const KV_LIST: KV[] = [
  {
    key: "eventEndDate",
    value: "2025-07-14T22:07:04.945Z",
  },
  {
    key: "isContestOpenToRegistration",
    value: "true",
  },
  {
    key: "contestRegistrationSecret",
    value: "placeholder secret for initialization",
  },
] as const;
