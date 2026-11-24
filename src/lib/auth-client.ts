import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL ||
    (typeof window !== "undefined" ? window.location.origin : undefined),
  plugins: [inferAdditionalFields<typeof auth>(), jwtClient()],
});

export const signInWithGoogle = () =>
  authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard",
  });

export const { signIn, signUp, useSession, signOut } = authClient;
export { getTokenFromClient } from "./getTokenFromClient";

