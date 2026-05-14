import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import { Email } from "@convex-dev/auth/providers/Email";
import { Password } from "@convex-dev/auth/providers/Password";
import {
  GenericDoc,
  convexAuth,
  createAccount,
  getAuthUserId,
  retrieveAccount,
  signInViaProvider,
} from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { z } from "zod";

import { internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel.d.ts";
import { internalAction, internalMutation } from "./_generated/server";
import { brevo } from "./email";

const emailProvider = Email({
  authorize: undefined,
  async sendVerificationRequest({ identifier: email, url }) {
    await brevo.transactionalEmails.sendTransacEmail({
      templateId: Number.parseInt(process.env.BREVO_LOGIN_TEMPLATE_ID!),
      to: [{ email }],
      params: { signInLink: url },
    });
  },
});

function createRallyistProvider() {
  const provider = "rallyist";

  const options = z.discriminatedUnion("flow", [
    z.object({
      flow: z.literal("signUp"),
      email: z.string().email(),
      name: z.string().optional(),
      language: z.string().default("en"),
      emailConsent: z.boolean().default(false),
      enforceAnonymousUpgrade: z.boolean(),
    }),
    z.object({
      flow: z.literal("sendMagicLink"),
      email: z.string().email(),
    }),
  ]);

  return ConvexCredentials<DataModel>({
    id: provider,
    authorize: async (suppliedParams, ctx) => {
      const { error, data: params } = options.safeParse(suppliedParams);
      if (error) {
        throw new ConvexError(error.message);
      }
      let user: GenericDoc<DataModel, "users">;
      if (params.flow === "signUp") {
        const isAlreadyRegistered = await retrieveAccount(ctx, {
          provider,
          account: { id: params.email },
        }).then(
          () => true,
          () => false,
        );
        if (isAlreadyRegistered) {
          throw new ConvexError("Email already used");
        }

        const userId = await getAuthUserId(ctx);
        if (userId) {
          console.info("Migrating anonymous user", userId);
          await ctx.runMutation(internal.auth.prepareAnonymousUserMigration, {
            email: params.email,
            params: {
              name: params.name,
              emailConsent: params.emailConsent,
              language: params.language,
            },
          });
        } else if (params.enforceAnonymousUpgrade) {
          throw new ConvexError("No anonymous account to link");
        }

        const created = await createAccount<DataModel>(ctx, {
          provider,
          account: { id: params.email },
          profile: {
            name: params.name,
            email: params.email,
            emailConsent: params.emailConsent,
            language: params.language,
            role: "user",
          },
          shouldLinkViaEmail: false,
          shouldLinkViaPhone: false,
        });
        ({ user } = created);
      } else if (params.flow === "sendMagicLink") {
        const { account } = await retrieveAccount(ctx, {
          provider,
          account: { id: params.email },
        });
        return await signInViaProvider(ctx, emailProvider, {
          accountId: account._id,
          params,
        });
      } else {
        throw new Error("Unknown flow");
      }
      return { userId: user._id };
    },
  });
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    emailProvider,
    createRallyistProvider(),
    Password({
      profile(params) {
        if (params.flow === "signUp") {
          throw new ConvexError("Password sign-ups are not allowed");
        }
        return {
          email: params.email as string,
        };
      },
    }),
    Anonymous({
      profile(params) {
        return {
          language: params.language ?? "en",
          role: "user",
          isAnonymous: true,
        };
      },
    }),
  ],
});

export const prepareAnonymousUserMigration = internalMutation({
  args: {
    email: v.string(),
    params: v.object({
      emailConsent: v.boolean(),
      name: v.optional(v.string()),
      language: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Unauthenticated");
    }

    // Assert this account is anon
    const user = await ctx.db.get("users", userId);
    if (!user?.isAnonymous) {
      throw new ConvexError("Cannot migrate a non-anon user");
    }

    await ctx.db.insert("authAccounts", {
      providerAccountId: args.email,
      provider: "rallyist",
      userId,
    });
    await ctx.db.patch("users", userId, {
      ...args.params,
      isAnonymous: false,
      email: args.email,
      role: "user",
    });
  },
});

export const createUserWithEmailPassword = internalAction({
  args: {
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("standist"), v.literal("staff")),
    name: v.string(),
    boothId: v.optional(v.id("booths")),
  },
  handler: async (ctx, args) => {
    await createAccount<DataModel>(ctx, {
      provider: "password",
      account: { id: args.email, secret: args.password },
      profile: {
        name: args.name,
        email: args.email,
        role: args.role,
        boothId: args.boothId,
      },
      shouldLinkViaEmail: false,
      shouldLinkViaPhone: false,
    });
    return true;
  },
});
