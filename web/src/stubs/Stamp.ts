import {
  Stamp,
  StampWithId,
} from "@vtube-stamp-rally/shared-lib/models/Stamp.ts";

// FUDE
export const NotSubmittedStamp = {
  standistId: "66873ba100357221ce45",
  expiryTimestamp: -1,
  signature:
    "data:application/octet-stream;base64,Iq/IEltsRiSutu0rhzwpUL8KFAxG5tmfCSzNQXRvZbPJnyd6JCvV8ISwCZFQ/Gy39kVrSvePC3WXxK70AWMTojsfdikIk/4qhxaQARapWGa6TikluoF/V9ZPqImxX8h9",
  submitted: false,
  scanTimestamp: 1720609434336,
} satisfies Stamp;

export const NotSubmittedStampWithId = {
  ...NotSubmittedStamp,
  id: 0,
} satisfies StampWithId;

export const OtherStamps = [
  {
    standistId: "66873ba1003566799f36",
    expiryTimestamp: 1720459990578,
    signature:
      "data:application/octet-stream;base64,cXcGX6izKXE4NvQ25Dq6uEF4mSiHzljTw7rBNThFPJx17O/wkXfecy+nlVp4N26IfKHexuZDrmMDdINR7/bR4hALogqLR7e6q0GUbtn1MYNjckc68qT3X3n6GvT0iFKe",
    submitted: false,
    scanTimestamp: 1720459991560,
  },
  {
    standistId: "66873ba10035758953e9",
    expiryTimestamp: -1,
    signature:
      "data:application/octet-stream;base64,mptIl9tlFO3uPOXcoXGKeDOfJ9IPTjecMbLZKxwxGVbKa3FeNM62c8WTQHxnTLJVhid4hIfWddywYigYW24gPi7dO9KEOunHCLL1DhZcyTFdjrEXAfJB3ux7REZVEU9W",
    submitted: false,
    scanTimestamp: 1720460013441,
  },
  {
    standistId: "66873ba1003576128a68",
    expiryTimestamp: 1722345585193,
    signature:
      "data:application/octet-stream;base64,b67boqFn+L893WP0vl2AQyjQz/wkpboteCdup5v7/dzS378+/L85KEsTx63XrtlLc8f1uRnavp1/tkidRvefJxGMSG1K259XRQXAFYX+IBQU/InJiRAIvm6nd5QMJVOZ",
    submitted: false,
    scanTimestamp: 1722345587491,
  },
  {
    standistId: "66873ba10035769b944d",
    expiryTimestamp: 1722345594436,
    signature:
      "data:application/octet-stream;base64,PM/rUw0PnsHscyX2C13p5vX7BB0dkfmMpg/PRDDFG5+8HmDU16r3B6c92INHK73XHeYdPzF/HFpniug5Z34z9ns/nfy3Q5/878ya1H0XZZWdR2W6U56Uy2mQxhH7VR9J",
    submitted: false,
    scanTimestamp: 1722345600818,
  },
  {
    standistId: "66873ba100357a6693e4",
    expiryTimestamp: 1722345662732,
    signature:
      "data:application/octet-stream;base64,ZMEYFEd6d00wD/Y2ueVrY+gpvwKIvNmfRhuOVM2ShNWHL8ja6vY2npMJdS9oEj+0bEITv8k1AGW8mbZGli4gEz8SRhjv6l9fY1yuO6bSnOU5+gU8bWUR2zOj9pFaiDmS",
    submitted: false,
    scanTimestamp: 1722345666688,
  },
  {
    standistId: "66873ba100357e9d64bb",
    expiryTimestamp: 1722345697775,
    signature:
      "data:application/octet-stream;base64,acoZvJxvnqzm/9WRf/cABc6TPBKhZfLm1yt0HbU1iQfq6Xof4bmLJia9bnrm9PBjC8CPHfMULhQyBtx9IaKsaL/s0fc5iOsaOZeYKXHTqctB1eN2qQnOk1WCw7mgPBoX",
    submitted: false,
    scanTimestamp: 1722345702286,
  },
  {
    standistId: "66873ba100358581d426",
    expiryTimestamp: 1722345796473,
    signature:
      "data:application/octet-stream;base64,m0j8uFrab/Ew1XdhAejEcmzqnBJ6Ne2Ob13U8Gt5OGXKMRgXDhDLOFSce4nr+st3Ti5qB8nLHEwnfNYEOdzXVQCw4/0jTc6nHieR8F1v/cFeIUlGXMA6OEzecLVQA+EJ",
    submitted: false,
    scanTimestamp: 1722345798797,
  },
  {
    standistId: "66873ba10035780190de",
    expiryTimestamp: 1722345872678,
    signature:
      "data:application/octet-stream;base64,UjWtzCMuOVbKQu4lVUPNvV0wXEV7rN8zNe3mGBq02Ffr5pSueDE2u6p/ClV0FYDPLdpbK2lghFfTUxQfZAh2msGFrMUNtsMHQr3pWRQFbO5xs1/ZSVYhKZ85tAWs5H4q",
    submitted: false,
    scanTimestamp: 1722345875570,
  },
  {
    standistId: "66873ba100357fcd48f0",
    expiryTimestamp: 1722345949505,
    signature:
      "data:application/octet-stream;base64,WGe+tbVCUsV69hU9ZwvZ1sRjy1bOsp/7GG/xum6XCcY9y4RewJ4Q/VqspRXwwFPHPVZVnI58B2uGxbbM+BlwiahHc5JJrR/bUEpBPyTIbQfACqWLQzpeE/4c44d0QHRg",
    submitted: false,
    scanTimestamp: 1722345953971,
  },
] satisfies Stamp[];

export const EnoughStamps = [
  NotSubmittedStamp,
  ...OtherStamps,
] satisfies Stamp[];

export const EnoughStampsWithId = // array of stamps
  EnoughStamps.map((stamp, index) => ({
    ...stamp,
    id: index,
  })) satisfies StampWithId[];
