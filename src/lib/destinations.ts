export interface Destination {
  id: string
  name: string
  country: string
  category: string
  price: number
  duration: string
  departureDate: string
  imageUrl: string
  description: string
  rating?: number
  reviewCount?: number
  highlights?: string[]
}

/**
 * Base URL of the travel-package backend. `NEXT_PUBLIC_API_URL` is a
 * build-time variable: it must exist in the environment whenever the app
 * is bundled (the local `.env`, or the Vercel dashboard for deploys).
 * There is deliberately no hardcoded fallback in the code — a missing
 * value fails loudly below instead of silently calling the wrong host.
 */
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not set. Copy .env.example to .env (local) " +
      "or set the variable in your Vercel project (deployed).",
  )
}

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "")

export function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

export function asNumber(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function getErrorDescription(res: Response): Promise<string> {
  return res
    .json()
    .then((body: unknown) => {
      if (body && typeof body === "object") {
        const record = body as Record<string, unknown>
        if (typeof record.message === "string") return record.message
        if (typeof record.detail === "string") return record.detail
      }

      return `The server responded with ${res.status}. Please try again.`
    })
    .catch(() => `The server responded with ${res.status}. Please try again.`)
}

export function normalizeDestination(raw: unknown): Destination | null {
  if (!raw || typeof raw !== "object") return null

  const record = raw as Record<string, unknown>
  const name = asString(record.destinationName)

  if (!name) return null

  const rating =
    typeof record.rating === "number" || asString(record.rating) !== ""
      ? asNumber(record.rating)
      : undefined

  const reviewCount =
    typeof record.reviewCount === "number" ||
    asString(record.reviewCount) !== ""
      ? asNumber(record.reviewCount)
      : undefined

  const highlights = Array.isArray(record.highlights)
    ? record.highlights.map(asString).filter(Boolean)
    : []

  return {
    id: asString(record._id) || asString(record.id),
    name,
    country: asString(record.country),
    category: asString(record.category),
    price: asNumber(record.price),
    duration: asString(record.duration),
    departureDate: asString(record.departureDate),
    imageUrl: asString(record.imageUrl),
    description: asString(record.description),
    rating,
    reviewCount,
    highlights: highlights.length > 0 ? highlights : undefined,
  }
}

/**
 * Reads every travel package from the backend.
 * Returns null when the backend cannot be reached or returns invalid data.
 */
export async function getDestinations(): Promise<Destination[] | null> {
  try {
    const res = await fetch(`${apiBaseUrl}/destinations`, {
      cache: "no-store",
    })

    if (!res.ok) return null

    const data: unknown = await res.json()
    if (!Array.isArray(data)) return null

    return data
      .map(normalizeDestination)
      .filter((item): item is Destination => item !== null)
  } catch {
    return null
  }
}

/**
 * Reads the backend's featured packages (`GET /featured-destination`).
 * Returns null when the backend cannot be reached or returns invalid data.
 */
export async function getFeaturedDestinations(): Promise<Destination[] | null> {
  try {
    const res = await fetch(`${apiBaseUrl}/featured-destination`, {
      cache: "no-store",
    })

    if (!res.ok) return null

    const data: unknown = await res.json()
    if (!Array.isArray(data)) return null

    return data
      .map(normalizeDestination)
      .filter((item): item is Destination => item !== null)
  } catch {
    return null
  }
}

export const destinationCategories = [
  "Beach",
  "Adventure",
  "City",
  "Culture",
  "Nature",
  "Luxury",
]

export type DestinationMutationResult =
  | { ok: true }
  | { ok: false; description: string }

/**
 * Updates a travel package using PATCH /destinations/:id.
 * `token` is the visitor's better-auth JWT — the backend rejects
 * this route without it.
 */
export async function updateDestination(
  id: string,
  payload: Record<string, unknown>,
  token: string | null,
): Promise<DestinationMutationResult> {
  try {
    const res = await fetch(
      `${apiBaseUrl}/destinations/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      },
    )

    if (!res.ok) {
      return { ok: false, description: await getErrorDescription(res) }
    }

    return { ok: true }
  } catch {
    return {
      ok: false,
      description: "Could not connect to the server. Please try again.",
    }
  }
}

/**
 * Deletes a travel package using DELETE /destination/:id.
 * `token` is the visitor's better-auth JWT — the backend rejects
 * this route without it.
 */
export async function deleteDestination(
  id: string,
  token: string | null,
): Promise<DestinationMutationResult> {
  try {
    const res = await fetch(
      `${apiBaseUrl}/destination/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: token ? { authorization: `Bearer ${token}` } : undefined,
      },
    )

    if (!res.ok) {
      return { ok: false, description: await getErrorDescription(res) }
    }

    return { ok: true }
  } catch {
    return {
      ok: false,
      description: "Could not connect to the server. Please try again.",
    }
  }
}

/** Used when a travel package has no usable image URL. */
export const fallbackDestinationImage = "/images/destinations/image1.png"

export type DestinationLookup =
  | { status: "found"; destination: Destination }
  | { status: "not-found" }
  | { status: "error" }

