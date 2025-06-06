import {
  Account,
  AppwriteException,
  Client,
  Databases,
  Functions,
  ID,
  Messaging,
  Storage,
} from "appwrite";

import { SendNotificationFunctionRequest } from "@vtube-stamp-rally/shared-lib/functions/sendNotification.ts";

import {
  appwriteEndpoint,
  appwriteNotificationProviderId,
  appwriteProjectId,
  assetsBucketId,
  sendNotificationFunctionId,
} from "@/lib/consts.ts";
import { LOCAL_STORAGE_KEYS } from "@/lib/localStorageKeys.ts";

export const client = new Client();

client.setEndpoint(appwriteEndpoint).setProject(appwriteProjectId);

export { ID, Query } from "appwrite";

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const storage = new Storage(client);
export const messaging = new Messaging(client);
export const getUserData = async () => {
  try {
    return account.get();
  } catch (error) {
    const appwriteError = error as AppwriteException;
    throw new Error("Cannot fetch user data", { cause: appwriteError });
  }
};

export const login = async (email: string, password: string) => {
  try {
    return account.createEmailPasswordSession(email, password);
  } catch (error) {
    const appwriteError = error as AppwriteException;
    throw new Error("Cannot login", { cause: appwriteError });
  }
};

export const loginAnonymous = async () => {
  try {
    const session = await account.createAnonymousSession();
    const user = await account.get();

    return { session, user };
  } catch (error) {
    const appwriteError = error as AppwriteException;
    throw new Error("Cannot login anonymously", { cause: appwriteError });
  }
};

export const setName = async (name: string) => {
  try {
    return account.updateName(name);
  } catch (error) {
    const appwriteError = error as AppwriteException;
    throw new Error("Cannot set name", { cause: appwriteError });
  }
};

export const setEmail = async (email: string) => {
  try {
    // ok so, we cheat: the appwrite sdk doesn't have a method to update the email only without supplying a password
    // so we generate a random password for that, and forget it
    const password = Array.from(
      { length: 32 },
      () => Math.random().toString(36)[2],
    ).join("");

    return account.updateEmail(email, password);
  } catch (error) {
    const appwriteError = error as AppwriteException;
    throw new Error("Cannot set email", { cause: appwriteError });
  }
};

export const setPref = async (
  key: string,
  value: string | number | boolean,
) => {
  try {
    const currentPrefs = await getPrefs();
    return account.updatePrefs({ ...currentPrefs, [key]: value });
  } catch (error) {
    const appwriteError = error as AppwriteException;
    throw new Error("Cannot set preference", { cause: appwriteError });
  }
};

export const getPrefs = async () => {
  try {
    return account.getPrefs();
  } catch (error) {
    const appwriteError = error as AppwriteException;
    throw new Error("Cannot get preferences", { cause: appwriteError });
  }
};

export const logout = async () => {
  try {
    return account.deleteSession("current");
  } catch (error: unknown) {
    const appwriteError = error as AppwriteException;
    throw new Error("Cannot logout", { cause: appwriteError });
  }
};

export const register = async (
  email: string,
  password: string,
  name: string,
) => {
  try {
    const account = new Account(client);
    return account.create("unique()", email, password, name);
  } catch (error) {
    const appwriteError = error as AppwriteException;
    throw new Error("Cannot register", { cause: appwriteError });
  }
};

export const sendMagicLink = async (email: string) => {
  try {
    console.log("sending magic link to", email);
    return account.createMagicURLToken(
      ID.unique(),
      email,
      window.location.origin + "/handleLogin",
    );
  } catch (error) {
    const appwriteError = error as AppwriteException;
    console.log("error", appwriteError);
    throw new Error("Cannot login with magic link", { cause: appwriteError });
  }
};

export const loginUserIdSecret = async (userId: string, secret: string) => {
  try {
    return account.createSession(userId, secret);
  } catch (error) {
    const appwriteError = error as AppwriteException;
    throw new Error("Cannot login with magic link", { cause: appwriteError });
  }
};

export const getAssetsFilesList = async () => {
  try {
    return storage.listFiles(assetsBucketId);
  } catch (error) {
    const appwriteError = error as AppwriteException;
    throw new Error("Cannot get files list", { cause: appwriteError });
  }
};

export const registerPushTarget = async (token: string) => {
  try {
    const existingPushTargetId = window.localStorage.getItem(
      LOCAL_STORAGE_KEYS.APPWRITE_PUSH_TARGET_ID,
    );
    if (existingPushTargetId) {
      await account.updatePushTarget(existingPushTargetId, token);
      return existingPushTargetId;
    } else {
      const { $id } = await account.createPushTarget(
        ID.unique(),
        token,
        appwriteNotificationProviderId,
      );
      window.localStorage.setItem(
        LOCAL_STORAGE_KEYS.APPWRITE_PUSH_TARGET_ID,
        $id,
      );
      return $id;
    }
  } catch (error) {
    const appwriteError = error as AppwriteException;
    throw new Error("Cannot register Push target", { cause: appwriteError });
  }
};

export const unregisterPushTarget = async () => {
  try {
    const existingPushTargetId = window.localStorage.getItem(
      LOCAL_STORAGE_KEYS.APPWRITE_PUSH_TARGET_ID,
    );
    if (!existingPushTargetId) return;
    await account.deletePushTarget(existingPushTargetId);
    window.localStorage.removeItem(LOCAL_STORAGE_KEYS.APPWRITE_PUSH_TARGET_ID);
  } catch (error) {
    const appwriteError = error as AppwriteException;
    throw new Error("Cannot unregister Push target", { cause: appwriteError });
  }
};

export const sendNotification = (
  title: string,
  text: string,
  topic: string,
) => {
  return functions.createExecution(
    sendNotificationFunctionId,
    JSON.stringify({
      title,
      text,
      topic,
    } satisfies SendNotificationFunctionRequest),
  );
};

export const subscribeToTopic = async (topicId: string, targetId?: string) => {
  const pushTargetId =
    targetId ??
    window.localStorage.getItem(LOCAL_STORAGE_KEYS.APPWRITE_PUSH_TARGET_ID);

  if (!topicId?.trim()) {
    throw new Error("Invalid topic ID provided");
  }

  if (!pushTargetId) {
    throw new Error(
      "No push target ID available. Notifications should be enabled beforehand.",
    );
  }

  await messaging.createSubscriber(topicId, ID.unique(), pushTargetId);
};
