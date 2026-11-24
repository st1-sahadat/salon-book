import { authClient } from "./auth-client";

/**
 * Retrieves the JWT token for the currently authenticated user from Better Auth client.
 * Returns null if the user is not authenticated or if token retrieval fails.
 */
export const getTokenFromClient = async (): Promise<string | null> => {
  try {
    const res = await authClient.token();
    const token = (res?.data as { token?: string } | undefined)?.token;
    return token || null;
  } catch (err) {
    console.error("Failed to retrieve token from authClient:", err);
    return null;
  }
};

export default getTokenFromClient;
