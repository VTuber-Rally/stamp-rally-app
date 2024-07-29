import { Decorator } from "@storybook/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { Suspense, useEffect, useState } from "react";
import { AppwriteException, Models } from "appwrite";
import { UserContext, UserContextType } from "@/lib/userContext.tsx";
import { LoggedInUser } from "@/stubs/User.ts";
import i18n from "@/lib/i18n.ts";
import { I18nextProvider } from "react-i18next";

export const TanStackQueryDecorator: Decorator = (Story, ctx) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, refetchOnMount: true } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Story {...ctx} />
    </QueryClientProvider>
  );
};

export const RouterDecorator: Decorator = (Story, ctx) => {
  const rootRoute = createRootRoute();
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
  });
  const memoryHistory = createMemoryHistory({ initialEntries: ["/"] });
  const routeTree = rootRoute.addChildren([indexRoute]);
  const router = createRouter({ routeTree, history: memoryHistory });

  return (
    <RouterProvider
      // @ts-ignore TODO: fix this someday
      router={router}
      defaultComponent={() => <Story {...ctx} />}
    />
  );
};

export const AuthDecorator: Decorator = (Story, ctx) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null,
  );

  const loginUser = async (email: string, password: string) => {
    console.log("loginUser", email, password);
    if (email === "staff@user.com" && password === "password") {
      setUser(LoggedInUser);
    } else if (email === "standist@user.com" && password === "password") {
      setUser(LoggedInUser);
    } else {
      throw new AppwriteException("Wrong email or password", 401);
    }
  };

  const registerUser = async (
    email: string,
    password: string,
    name: string,
  ) => {
    try {
      console.log("registerUser", email, password, name);
      setUser(LoggedInUser);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const logoutUser = async () => {
    try {
      setUser(null);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const loginAnonymousUser = async () => {
    try {
      setUser(LoggedInUser);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const setUserName = async (name: string) => {
    if (user === null) {
      throw new Error("User is not logged in");
    }
    try {
      setUser({ ...user, name });
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const setUserEmail = async (email: string) => {
    if (user === null) {
      throw new Error("User is not logged in");
    }

    try {
      setUser({ ...user, email });
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const setPrefUser = async (key: string, value: string | number | boolean) => {
    if (user === null) {
      throw new Error("User is not logged in");
    }
    try {
      setUser({ ...user, prefs: { ...user.prefs, [key]: value } });
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const contextData = {
    user,
    login: loginUser,
    logout: logoutUser,
    loginAnonymous: loginAnonymousUser,
    setName: setUserName,
    setEmail: setUserEmail,
    setPref: setPrefUser,
    register: registerUser,
  } satisfies UserContextType;

  return (
    <UserContext.Provider value={contextData}>
      <Story {...ctx} />
    </UserContext.Provider>
  );
};

export const I18nextDecorator: Decorator = (Story, context) => {
  const { locale } = context.globals;

  // When the locale global changes
  // Set the new locale in i18n
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  return (
    <Suspense fallback={<div>loading translations...</div>}>
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    </Suspense>
  );
};
