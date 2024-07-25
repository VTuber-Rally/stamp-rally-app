import {
  Client,
  Databases,
  Account,
  AppwriteException,
  Functions,
} from "appwrite";
import { appwriteProjectId } from "@/lib/consts.ts";

export const client = new Client();

client.setEndpoint("https://appwrite.luc.ovh/v1").setProject(appwriteProjectId);

export { ID, Query } from "appwrite";

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);

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

export const setPref = async (key: string, value: string | number) => {
  try {
    return account.updatePrefs({ [key]: value });
  } catch (error) {
    const appwriteError = error as AppwriteException;
    throw new Error("Cannot set name", { cause: appwriteError });
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
