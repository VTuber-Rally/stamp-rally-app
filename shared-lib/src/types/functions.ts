export type SubmitRallyFunctionResponse =
  | {
      status: "success";
      submissionId: string;
    }
  | {
      status: "error";
      message: string;
    };
