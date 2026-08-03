import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { internal } from "./_generated/api";

const password = Password({
  profile(params) {
    if (typeof params.email !== "string" || !params.email.trim()) {
      throw new Error("Invalid email");
    }
    return {
      email: params.email.trim().toLowerCase(),
    };
  },
});

type PasswordAuthorize = NonNullable<typeof password.authorize>;

const passwordWithEmailCheck = {
  ...password,
  authorize: async (
    credentials: Parameters<PasswordAuthorize>[0],
    ctx: Parameters<PasswordAuthorize>[1]
  ) => {
    if (credentials.flow === "signUp") {
      const email =
        typeof credentials.email === "string"
          ? credentials.email.trim().toLowerCase()
          : "";
      if (email) {
        const existing = await ctx.runQuery(internal.users.findByEmail, {
          email,
        });
        if (existing !== null) {
          throw new ConvexError("EMAIL_ALREADY_REGISTERED");
        }
      }
    }
    return password.authorize!(credentials, ctx);
  },
};

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [passwordWithEmailCheck, Google],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, { userId, profile }) {
      if (typeof profile.email !== "string") return;
      const email = profile.email.trim().toLowerCase();
      const user = await ctx.db.get(userId);
      if (user && user.email !== email) {
        await ctx.db.patch(userId, { email });
      }
    },
  },
});
