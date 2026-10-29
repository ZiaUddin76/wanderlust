import "server-only"

import { apiBaseUrl } from "@/lib/destinations"
import {
  normalizeDestination,
  type DestinationLookup,
} from "@/lib/destinations"
import { getTokenFromServer } from "./getTokenFromServer"

export async function getDestination(
  id: string,
): Promise<DestinationLookup> {
  try {
    const token = await getTokenFromServer()

    if (!token) {
      // The backend route requires a valid JWT, so without a session
      // token the destination is simply unreachable for this visitor.
      return { status: "not-found" }
    }

    const res = await fetch(
      `${apiBaseUrl}/destinations/${encodeURIComponent(id)}`,
      {
        cache: "no-store",
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    )

    if (res.status === 404) {
      return { status: "not-found" }
    }

    if (!res.ok) {
      return { status: "error" }
    }

    const destination = normalizeDestination(await res.json())

    return destination
      ? { status: "found", destination }
      : { status: "not-found" }
  } catch {
    return { status: "error" }
  }
}
