import { Models } from "appwrite";
import { createContext } from "react";

const NOT_INITIALIZED = undefined;

const notInitialized = () => {
  throw new Error("UserContext is not initialized");
};

export const UserContext = createContext<UserContextType>({
  user: NOT_INITIALIZED,
  login: notInitialized,
  logout: notInitialized,
  loginAnonymous: notInitialized,
  createMagicLink: notInitialized,
  registerMagicLink: notInitialized,
  setName: notInitialized,
  setEmail: notInitialized,
  setPref: notInitialized,
  register: notInitialized,
});

export type UserContextType = {
  user: Models.User<Models.Preferences> | null | undefined; // logged, not logged, not initialized
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginAnonymous: () => Promise<void>;
  createMagicLink: (email: string) => Promise<void>;
  registerMagicLink: (userId: string, secret: string) => Promise<void>;
  setName: (name: string) => Promise<void>;
  setEmail: (email: string) => Promise<void>;
  setPref: (key: string, value: string | number | boolean) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
};
