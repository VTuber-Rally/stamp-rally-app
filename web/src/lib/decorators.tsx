import { Decorator } from "@storybook/react";
import { fn } from "@storybook/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AppwriteException, Models } from "appwrite";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import { I18nextProvider } from "react-i18next";

import { Drawer, DrawerContent } from "@/components/layout/Drawer.tsx";
import { QRCodeDrawer } from "@/components/scan/QRCodeDrawer.tsx";
import { Toaster } from "@/components/toasts/Toaster.tsx";
import { QRDrawerContext } from "@/contexts/QRDrawerContext.tsx";
import i18n from "@/lib/i18n.ts";
import { UserContext, UserContextType } from "@/lib/userContext.tsx";
import {
  LoggedInUser,
  LoggedInUserStaff,
  LoggedInUserStandist,
} from "@/stubs/User.ts";

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (parameters?.auth?.user as Models.User<Models.Preferences>) ?? null,
  );

  const loginUser = (email: string, password: string) => {
    console.log("loginUser", email, password);
    if (email === "staff@user.com" && password === "password") {
      setUser(LoggedInUserStaff);
    } else if (email === "standist@user.com" && password === "password") {
      setUser(LoggedInUserStandist);
    } else {
      throw new AppwriteException("Wrong email or password", 401);
    }
    return Promise.resolve();
  };

  const registerUser = (email: string, password: string, name: string) => {
    try {
      console.log("registerUser", email, password, name);
      setUser(LoggedInUser);
    } catch (error) {
      throw new Error((error as Error).message);
    }
    return Promise.resolve();
  };

  const logoutUser = () => {
    try {
      setUser(null);
    } catch (error) {
      throw new Error((error as Error).message);
    }
    return Promise.resolve();
  };

  const loginAnonymousUser = () => {
    try {
      setUser(LoggedInUser);
    } catch (error) {
      throw new Error((error as Error).message);
    }
    return Promise.resolve();
  };

  const setUserName = (name: string) => {
    if (user === null) {
      throw new Error("User is not logged in");
    }
    try {
      setUser({ ...user, name });
    } catch (error) {
      throw new Error((error as Error).message);
    }
    return Promise.resolve();
  };

  const setUserEmail = (email: string) => {
    if (user === null) {
      throw new Error("User is not logged in");
    }

    try {
      setUser({ ...user, email });
    } catch (error) {
      throw new Error((error as Error).message);
    }

    return Promise.resolve();
  };

  const setPrefUser = (key: string, value: string | number | boolean) => {
    if (user === null) {
      throw new Error("User is not logged in");
    }
    try {
      setUser({ ...user, prefs: { ...user.prefs, [key]: value } });
    } catch (error) {
      throw new Error((error as Error).message);
    }
    return Promise.resolve();
  };

  const contextData = {
    user,
    login: loginUser,
    logout: logoutUser,
    loginAnonymous: loginAnonymousUser,
    createMagicLink: (email: string) => {
      console.log("createMagicLink", email);
      return Promise.resolve();
    },
    registerMagicLink: (userId: string, secret: string) => {
      console.log("registerMagicLink", userId, secret);
      return Promise.resolve();
    },
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
  const { locale } = context.globals as { locale: string };

  // When the locale global changes
  // Set the new locale in i18n
  useEffect(() => {
    void i18n.changeLanguage(locale);
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
