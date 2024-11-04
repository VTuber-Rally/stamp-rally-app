import { AppwriteException, Models } from "appwrite";
import { createContext, ReactNode, useEffect, useState } from "react";
import {
  account,
  login,
  loginAnonymous,
  sendMagicLink,
  logout,
  register,
  setEmail,
  setName,
  setPref,
  loginUserIdSecret,
} from "./appwrite";
import Loader from "@/components/Loader.tsx";
import { useTranslation } from "react-i18next";

const NOT_INITIALIZED = undefined;

const notInitialized = async () => {
  throw new Error("UserContext is not initialized");
};

// eslint-disable-next-line react-refresh/only-export-components
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

export function UserProvider({
  registerAutoAnonymous = false,
  children,
}: {
  registerAutoAnonymous?: boolean;
  children: ReactNode;
}) {
  const [user, setUser] = useState<
    Models.User<Models.Preferences> | null | undefined
  >(NOT_INITIALIZED);

  const loginUser = async (email: string, password: string) => {
    try {
      const session = await login(email, password);
      console.log(session);
      const user = await account.get();
      setUser(user);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const registerUser = async (
    email: string,
    password: string,
    name: string,
  ) => {
    try {
      const user = await register(email, password, name);
      setUser(user);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const loginAnonymousUser = async () => {
    try {
      await loginAnonymous();
      const user = await account.get();
      setUser(user);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const setUserName = async (name: string) => {
    try {
      const user = await setName(name);
      setUser(user);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const setUserEmail = async (email: string) => {
    try {
      const user = await setEmail(email);
      setUser(user);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const setPrefUser = async (key: string, value: string | number | boolean) => {
    try {
      const user = await setPref(key, value);
      setUser(user);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const sendLoginMagicLink = async (email: string) => {
    try {
      const resp = await sendMagicLink(email);
      console.log("sendMagicLink", resp);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const registerMagicLink = async (userId: string, secret: string) => {
    try {
      await loginUserIdSecret(userId, secret);
      const user = await account.get();
      setUser(user);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const contextData = {
    user,
    login: loginUser,
    logout: logoutUser,
    loginAnonymous: loginAnonymousUser,
    createMagicLink: sendLoginMagicLink,
    registerMagicLink,
    setName: setUserName,
    setEmail: setUserEmail,
    setPref: setPrefUser,
    register: registerUser,
  } satisfies UserContextType;

  useEffect(() => {
    async function init() {
      try {
        const loggedIn = await account.get();
        console.log("logged in", loggedIn);
        setUser(loggedIn);
        console.log("user", loggedIn);
      } catch (err) {
        if (err instanceof AppwriteException) {
          console.log(err.code, err.type, err.response, err.message);

          // si l'erreur est de type "general_unauthorized_scope" et que registerAutoAnonymous est true
          // cela signifie qu'on est pas connecté et qu'on doit se connecter en tant qu'utilisateur anonyme
          if (
            err.type == "general_unauthorized_scope" &&
            registerAutoAnonymous
          ) {
            // register anonymous user
            await loginAnonymous();
            const user = await account.get();
            setUser(user);
            return;
          }
        }

        console.error(err);
        setUser(null);
      }
    }

    init();
  }, [registerAutoAnonymous]);

  return (
    <UserContext.Provider value={contextData}>
      {user === undefined ? <LoaderPage /> : children}
    </UserContext.Provider>
  );
}

const LoaderPage = () => {
  const { t } = useTranslation();
  return (
    <div className={"h-dvh flex flex-col pb-16"}>
      <div className="flex-grow flex items-center justify-center">
        <div className={"flex flex-col items-center"}>
          <Loader size={4} />
          <h1>{t("loading")}</h1>
        </div>
      </div>
    </div>
  );
};
