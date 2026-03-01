import {
  type AuthFunctions,
  type GenericCtx,
  createClient,
} from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { requireRunMutationCtx } from "@convex-dev/better-auth/utils";
import { betterAuth } from "better-auth/minimal";
import { anonymous, magicLink } from "better-auth/plugins";
import { v } from "convex/values";

import { components, internal } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";
import authConfig from "./auth.config";
import { brevo } from "./email";

const siteUrl = process.env.SITE_URL!;

const authFunctions: AuthFunctions = internal.auth;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  triggers: {
    user: {
      onCreate: async (ctx, doc) => {
        await ctx.db.insert("userInfo", {
          userId: doc._id,
          role: "user",
          language: "en",
          emailConsent: false,
        });
      },
    },
  },
});

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    trustedOrigins: ["localhost:5173", siteUrl],
    rateLimit: {
      enabled: false,
    },
    baseURL: process.env.CONVEX_SITE_URL,
    database: authComponent.adapter(ctx),
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
    },
    plugins: [
      crossDomain({ siteUrl }),
      convex({ authConfig }),
      anonymous({
        onLinkAccount: async ({ anonymousUser, newUser }) => {
          console.log(anonymousUser, newUser);
          const mutationCtx = requireRunMutationCtx(ctx);
          await mutationCtx.runMutation(internal.auth.migrateAnonymousUser, {
            anonymousUid: anonymousUser.user.id,
            newUid: newUser.user.id,
          });
        },
      }),
      magicLink({
        async sendMagicLink({ email, url }) {
          await brevo.transactionalEmails.sendTransacEmail({
            templateId: Number.parseInt(process.env.BREVO_LOGIN_TEMPLATE_ID!),
            to: [{ email }],
            params: { signInLink: url },
          });
        },
      }),
    ],
  });
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = authComponent.getAuthUser(ctx).then(
      (u) => u,
      () => null,
    );

    // TODO : get profile

    return user;
  },
});

export const migrateAnonymousUser = internalMutation({
  args: { anonymousUid: v.string(), newUid: v.string() },
  handler: async (ctx, { anonymousUid, newUid }) => {
    const anonymousUserInfo = await ctx.db
      .query("userInfo")
      .withIndex("by_user_id", (q) => q.eq("userId", anonymousUid))
      .unique();
    const newUserInfo = await ctx.db
      .query("userInfo")
      .withIndex("by_user_id", (q) => q.eq("userId", newUid))
      .unique();

    console.log(anonymousUserInfo, newUserInfo);
  },
});

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();
