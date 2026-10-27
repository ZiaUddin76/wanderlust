import {
  apiBaseUrl,
  asNumber,
  asString,
  getErrorDescription,
} from "./destinations"

export type BookingStatus = "confirmed" | "pending"

export interface Booking {
  id: string
  destinationId: string
  name: string
  imageUrl: string
  price: number
  departureDate: string
  status: BookingStatus
}

/** Formats `YYYY-MM-DD` (or a full date string) as "May 15, 2026". */
export function formatBookingDate(value: string): string {
  if (!value) return "To be announced"

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function normalizeBooking(raw: unknown): Booking | null {
  if (!raw || typeof raw !== "object") return null

  const record = raw as Record<string, unknown>
  const id = asString(record._id) || asString(record.id) || asString(record.bookingId)
  const name = asString(record.destinationName) || asString(record.name)

  if (!id && !name) return null

  const statusRaw = asString(record.status).toLowerCase()

  return {
    id: id || name,
    destinationId: asString(record.destinationId),
    name: name || "Unnamed booking",
    imageUrl: asString(record.imageUrl) || asString(record.image),
    price: asNumber(record.price),
    departureDate: asString(record.departureDate),
    // Bookings default to "confirmed" until the backend marks them otherwise.
    status: statusRaw === "pending" ? "pending" : "confirmed",
  }
}

/**
 * Reads every booking the backend has stored for the given user email.
 * Returns `null` when the backend cannot be reached so the page can
 * distinguish "no data" from "failed to load".
 */
export async function getBookingsByEmail(email: string): Promise<Booking[] | null> {
  try {
    const res = await fetch(
      `${apiBaseUrl}/my-bookings/${encodeURIComponent(email)}`,
      { cache: "no-store" },
    )

    if (!res.ok) return null

    const data: unknown = await res.json()

    // The backend may return a bare array or an object like { bookings: [...] }.
    const list = Array.isArray(data)
      ? data
      : Array.isArray((data as { bookings?: unknown[] })?.bookings)
        ? (data as { bookings: unknown[] }).bookings
        : null

    if (!list) return null

    return list
      .map(normalizeBooking)
      .filter((item): item is Booking => item !== null)
  } catch {
    return null
  }
}

export type BookingMutationResult =
  | { ok: true }
  | { ok: false; description: string }

/** Sends `DELETE /mybookings/:id` — same result shape as `deleteDestination`. */
export async function cancelBooking(
  id: string,
): Promise<BookingMutationResult> {
  try {
    const res = await fetch(
      `${apiBaseUrl}/mybookings/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    )

    if (!res.ok) {
      return { ok: false, description: await getErrorDescription(res) }
    }

    const result = (await res.json()) as { deletedCount?: number }

    if (typeof result?.deletedCount === "number" && result.deletedCount === 0) {
      return {
        ok: false,
        description: "The booking could not be found. It may already be cancelled.",
      }
    }

    return { ok: true }
  } catch {
    return {
      ok: false,
      description: "Could not connect to the server. Please try again.",
    }
  }
}
