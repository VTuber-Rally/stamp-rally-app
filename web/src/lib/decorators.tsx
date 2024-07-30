import { Decorator } from "@storybook/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppwriteException, Models } from "appwrite";
import { UserContext, UserContextType } from "@/lib/userContext.tsx";
import {
  LoggedInUser,
  LoggedInUserStaff,
  LoggedInUserStandist,
} from "@/stubs/User.ts";
import i18n from "@/lib/i18n.ts";
import { I18nextProvider } from "react-i18next";
import { Drawer, DrawerContent } from "@/components/Drawer.tsx";
import { fn } from "@storybook/test";
import { QRDrawerContext } from "@/context/QRDrawerContext.tsx";
import { QRCodeDrawer } from "@/components/QRCodeDrawer.tsx";
import { Toaster } from "@/components/ToastViewport.tsx";

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
      // @ts-expect-error je ne pense pas qu'il soit nécessaire de typer correctement le routeur ici
      router={router}
      defaultComponent={() => <Story {...ctx} />}
    />
  );
};

export const AuthDecorator: Decorator = (Story, ctx) => {
  const { parameters } = ctx;

  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    parameters?.auth?.user ?? null,
  );

  const loginUser = async (email: string, password: string) => {
    console.log("loginUser", email, password);
    if (email === "staff@user.com" && password === "password") {
      setUser(LoggedInUserStaff);
    } else if (email === "standist@user.com" && password === "password") {
      setUser(LoggedInUserStandist);
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

export const DialogDecorator: Decorator = (Story, ctx) => {
  return (
    <Drawer open={true} onOpenChange={fn}>
      <DrawerContent>
        <Story {...ctx} />
      </DrawerContent>
    </Drawer>
  );
};

export const QRDrawerContextProviderDecorator: Decorator = (Story, ctx) => {
  const [open, setOpen] = useState(false);
  const contextValue = useMemo<[boolean, Dispatch<SetStateAction<boolean>>]>(
    () => [open, setOpen],
    [open],
  );

  return (
    <QRDrawerContext.Provider value={contextValue}>
      <QRCodeDrawer />
      <Story {...ctx} />
    </QRDrawerContext.Provider>
  );
};

export const ToasterDecorator: Decorator = (Story, ctx) => {
  return (
    <>
      <Story {...ctx} />
      <Toaster />
    </>
  );
};
