import { Models } from "appwrite";

export const NotLoggedInUser = null;

export const LoggedInUser = {
  // anonymous user
  $id: "123",
  $createdAt: "2024-07-29T22:33:22.874+00:00",
  $updatedAt: "2024-07-29T22:33:22.874+00:00",
  name: "",
  registration: "2024-07-29T22:33:22.870+00:00",
  status: true,
  labels: [],
  passwordUpdate: "",
  email: "",
  phone: "",
  emailVerification: false,
  phoneVerification: false,
  mfa: false,
  prefs: {},
  targets: [],
  accessedAt: "2024-07-29T22:33:22.870+00:00",
} satisfies Models.User<Models.Preferences>;

export const LoggedInUserStaff = {
  ...LoggedInUser,
  name: "Staff User",
  email: "staff@user.com",
  labels: ["staff"],
} satisfies Models.User<Models.Preferences>;

export const LoggedInUserStandist = {
  ...LoggedInUser,
  $id: "66873ba100357c59f3bf",
  labels: ["standist"],
  name: "Standist User",
  email: "standist@user.com",
  prefs: {
    privateKey:
      '{"crv":"P-384","d":"fP_1OjOSjodtA3x5ZaAa1nrDcKKy-xTCYIjZtHR-08-bGl04YiVE-TnODrLLhN_p","ext":true,"key_ops":["sign"],"kty":"EC","x":"fSfZEYNpSIu2iNJ9AXlL62QZDWvxa0trARMNP7LvJ-8jX16lNlWuJyBwRCzgB4ov","y":"z1vf_o3XYZXGr53JcsBueFqR-lRTOra6eagJca3pmtqHAzs4zUuWGTQ2Ek-9XeyA"}',
    publicKey:
      '{"crv":"P-384","ext":true,"key_ops":["verify"],"kty":"EC","x":"fSfZEYNpSIu2iNJ9AXlL62QZDWvxa0trARMNP7LvJ-8jX16lNlWuJyBwRCzgB4ov","y":"z1vf_o3XYZXGr53JcsBueFqR-lRTOra6eagJca3pmtqHAzs4zUuWGTQ2Ek-9XeyA"}',
  },
} satisfies Models.User<Models.Preferences>;

export const GetPrivateKeyExecutionReturn = {
  $id: "66a9451d62f0f6bd61d0",
  $createdAt: "2024-07-30T19:55:09.591+00:00",
  $updatedAt: "2024-07-30T19:55:09.591+00:00",
  $permissions: ['read("user:667c9e49c06b76c6ac7e")'],
  functionId: "118315b50900e5b86311",
  trigger: "http",
  status: "completed",
  requestMethod: "POST",
  requestPath: "/",
  requestHeaders: [],
  responseStatusCode: 200,
  responseBody:
    '{"crv":"P-384","d":"xk4ax7iA6V5-PKYo_d6m17Bp_uxz3XpHdhVi4h-28iv1d3pa3CjT_-pB5BJHVvux","ext":true,"key_ops":["sign"],"kty":"EC","x":"al8XAlNAKobpLir2qtKY_V-bqq_AsZ3mNNbibRcQuYr4wtJGf_-BtJzkfUtm1vY7","y":"TJ-prPwWFG3EJNctEYu5M3WcXcXKeZpl4a5YYw7redNeCrd2r6sFBi9rNyetUOYd"}',
  responseHeaders: [
    { name: "content-type", value: "application/json; charset=utf-8" },
    { name: "content-length", value: "269" },
    { name: "date", value: "Tue, 30 Jul 2024 19:55:09 GMT" },
    { name: "connection", value: "keep-alive" },
    { name: "keep-alive", value: "timeout=5" },
  ],
  logs: "",
  errors: "",
  duration: 0.11608314514160156,
} satisfies Models.Execution;
