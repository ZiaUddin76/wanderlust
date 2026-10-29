import { authClient } from "./auth-client"

export const getTokenFromClient = async (): Promise<string | null> => {
    // The JWT plugin exposes a GET /token endpoint; `authClient.token()` is
    // not one of its generated client actions, so fetch the endpoint
    // directly with $fetch. The session cookie is sent automatically.
    const { data } = await authClient.$fetch<{ token: string }>("/token", {
        method: "GET",
    })

    const token = data?.token

    return token ?? null;
}
