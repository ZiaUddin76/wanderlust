import { Suspense } from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { DestinationCard } from "@/components/destination-card"
import { getFeaturedDestinations } from "@/lib/destinations"

/** Matches the layout of the loaded grid so the placeholder doesn't jump. */
function FeaturedSkeleton() {
  return (
    <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-video animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-3 w-24 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 flex items-baseline justify-between">
            <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-14 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="mt-2 h-3 w-28 animate-pulse rounded bg-slate-200" />
        </div>
      ))}
    </div>
  )
}

async function FeaturedGrid() {
  const destinations = await getFeaturedDestinations()

  // Without the backend there is no featured data — omit the section
  // entirely instead of showing an empty box on the homepage.
  if (!destinations || destinations.length === 0) {
    return null
  }

  return (
    <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map((destination) => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </div>
  )
}

/**
 * Homepage featured section — reads `GET /featured-destination` from the
 * backend. Because the data is uncached, it streams via Suspense while the
 * rest of the page renders.
 */
export function Featured() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-widest text-brand uppercase">
            Featured
          </p>
          <h2 className="font-heading mt-2 text-4xl font-medium text-neutral-900 sm:text-5xl">
            Featured Destinations
          </h2>
          <p className="mt-3 text-sm text-neutral-500 sm:text-base">
            Handpicked travel packages our travelers love the most
          </p>
          <Link
            href="/destinations"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-brand uppercase transition-colors hover:text-brand/80"
          >
            View All Destinations
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>

        <Suspense fallback={<FeaturedSkeleton />}>
          <FeaturedGrid />
        </Suspense>
      </div>
    </section>
  )
}

export default Featured
