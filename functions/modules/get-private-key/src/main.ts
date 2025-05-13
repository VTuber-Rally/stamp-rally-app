import { Client, Users } from "node-appwrite";
import type { Context, GetPrivateKeyFunctionResponse } from "shared-lib";
import { GetPrivateKeyFunctionRequestValidator } from "shared-lib/src/functions/getPrivateKey";
import { UserPreferences } from "shared-lib/src/types/userPreferences";

export default async ({ req, res }: Context<GetPrivateKeyFunctionResponse>) => {
  const client = new Client()
    .setEndpoint(process.env["APPWRITE_FUNCTION_API_ENDPOINT"]!)
    .setProject(process.env["APPWRITE_FUNCTION_PROJECT_ID"]!)
    .setKey(req.headers["x-appwrite-key"]);

  const users = new Users(client);

  const { success: isDataValid, data } =
    GetPrivateKeyFunctionRequestValidator.safeParse(JSON.parse(req.body));

  if (!isDataValid) {
    return res.send("", 401);
  }

  try {
    const user = await users.get(data.userId);

    if (!user) {
      return res.json({ status: "error", message: "User not found" });
    }

    return res.json({
      status: "success",
      privateKey: JSON.parse(
        (user.prefs as UserPreferences).privateKey!,
      ) as JsonWebKey,
    });
  } catch (e) {
    return res.json({
      status: "error",
      message: `Failed to get private key: ${e as Error}`,
    });
  }
};
