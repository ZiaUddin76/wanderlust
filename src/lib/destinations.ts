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

export const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/+$/, "")

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

function normalizeDestination(raw: unknown): Destination | null {
  if (!raw || typeof raw !== "object") return null

  const record = raw as Record<string, unknown>
  const name = asString(record.destinationName)

  if (!name) return null

  const rating =
    typeof record.rating === "number" || asString(record.rating) !== ""
      ? asNumber(record.rating)
      : undefined

  const reviewCount =
    typeof record.reviewCount === "number" || asString(record.reviewCount) !== ""
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
 * Reads every travel package from the backend's MongoDB collection.
 * Returns `null` when the backend cannot be reached so the page can
 * distinguish "no data" from "failed to load".
 */
export async function getDestinations(): Promise<Destination[] | null> {
  try {
    const res = await fetch(`${apiBaseUrl}/destinations`, { cache: "no-store" })

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
 * Sends the edited travel package to the backend's `PATCH /destination/:id`.
 * Returns a human-readable error description, or `{ ok: true }` on success.
 */
export async function updateDestination(
  id: string,
  payload: Record<string, unknown>,
): Promise<DestinationMutationResult> {
  try {
    const res = await fetch(
      `${apiBaseUrl}/destinations/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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

/** Sends `DELETE /destination/:id` — same result shape as `updateDestination`. */
export async function deleteDestination(
  id: string,
): Promise<DestinationMutationResult> {
  try {
    const res = await fetch(
      `${apiBaseUrl}/destination/${encodeURIComponent(id)}`,
      { method: "DELETE" },
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

/**
 * Reads a single travel package by its MongoDB id.
 *
 * The backend answers 200 with a `null` body for ids it does not know and 500
 * for ids it cannot parse, so anything that is not a usable document is
 * reported as `not-found`; `error` is reserved for transport failures.
 */
export async function getDestination(id: string): Promise<DestinationLookup> {
  try {
    const res = await fetch(
      `${apiBaseUrl}/destinations/${encodeURIComponent(id)}`,
      { cache: "no-store" },
    )

    if (!res.ok) return { status: "not-found" }

    const destination = normalizeDestination(await res.json())
    return destination
      ? { status: "found", destination }
      : { status: "not-found" }
  } catch {
    return { status: "error" }
  }
}
