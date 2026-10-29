import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/**
 * Auth runs inside this Next.js app (`src/app/api/auth/[...all]/route.ts`),
 * so the client should always use same-origin `/api/auth`. Passing a
 * `BETTER_AUTH_URL`-style base URL here sends login/signup requests to the
 * wrong host once the app is deployed (localhost or another domain).
 */
export const authClient = createAuthClient({
  plugins: [
    jwtClient()
  ]  
})
