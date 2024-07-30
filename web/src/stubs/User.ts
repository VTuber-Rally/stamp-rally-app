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
