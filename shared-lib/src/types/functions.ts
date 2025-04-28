export type GetPrivateKeyFunctionResponse =
  | {
      status: "success";
      privateKey: JsonWebKey;
    }
  | {
      status: "error";
      message: string;
    };

export type SubmitRallyFunctionResponse =
  | {
      status: "success";
      submissionId: string;
    }
  | {
      status: "error";
      message: string;
    };

export type RegisterContestParticipantFunctionResponse =
  | ({
      status: string;
      message: string;
    } & {
      status: "success";
      contestParticipantId: string;
    })
  | {
      status: "error";
      message: string;
      error: string;
    };
