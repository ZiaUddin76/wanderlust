"use client"

import { useRouter } from "next/navigation"
import { CheckIcon } from "lucide-react"
import type { Destination } from "@/lib/destinations"
import BookingCard from "./booking/BookingCard"

const perks = [
  "Free cancellation up to 7 days",
  "Travel insurance included",
  "24/7 customer support",
]

export function DestinationBookingCard({
  destination,
}: {
  destination: Destination
}) {
  const router = useRouter()

  // Called by BookingCard when guests try to book — sends them to login.
  function handleGuestBook() {
    router.push("/login")
  }

  return (
    <aside className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:sticky lg:top-8">
      <p className="text-xs text-zinc-500">Starting from</p>

      <p className="font-heading mt-1 text-3xl text-brand">
        ${destination.price}
      </p>

      <p className="mt-1 text-xs text-zinc-500">per person</p>

      <BookingCard
        destination={destination}
        departureDate={destination.departureDate}
        onBookNow={handleGuestBook}
      />

      <ul className="mt-5 space-y-2.5">
        {perks.map((perk) => (
          <li
            key={perk}
            className="flex items-start gap-2 text-xs text-zinc-600"
          >
            <CheckIcon className="mt-px size-3.5 shrink-0 text-emerald-500" />
            {perk}
          </li>
        ))}
      </ul>
    </aside>
  )
}