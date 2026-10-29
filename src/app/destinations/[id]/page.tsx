import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CheckIcon,
  MapPinIcon,
  StarIcon,
  TagIcon,
} from "lucide-react"
import { notFound } from "next/navigation"

import { DestinationBookingCard } from "@/components/destination-booking-card"
import { getDestination } from "@/lib/destination-server"
import { fallbackDestinationImage} from "@/lib/destinations"
import { EditDestinationDialog } from "@/components/EditDestinationDialogue"
import { DeleteDestinationDialog } from "@/components/DeleteDestinationDialogue"

export const dynamic = "force-dynamic"

interface DestinationDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function DestinationDetailsPage({
  params,
}: DestinationDetailsPageProps) {
  const { id } = await params
  const result = await getDestination(id)

  if (result.status === "not-found") {
    notFound()
  }

  if (result.status === "error") {
    return (
      <main className="flex min-h-screen flex-1 flex-col bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
          <h1 className="font-heading text-4xl font-normal text-neutral-900">
            Something went wrong
          </h1>
          <p className="max-w-md text-sm text-neutral-500">
            We could not reach the travel server right now. Please try again in
            a moment.
          </p>
          <Link
            href="/destinations"
            className="flex items-center gap-2 text-sm font-semibold text-brand uppercase transition-colors hover:text-brand/80"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Destinations
          </Link>
        </div>
      </main>
    )
  }

  const destination = result.destination

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-white">
      <div className="mx-auto w-full max-w-7xl px-6 pt-8 pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/destinations"
            className="flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-brand"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Destinations
          </Link>

          <div className="flex items-center gap-3">
            <EditDestinationDialog destination={destination} />

            <DeleteDestinationDialog id={id} />
          </div>
        </div>

        <div className="relative mt-6 aspect-[5/2] overflow-hidden rounded-xl bg-sky-50">
          <Image
            src={destination.imageUrl || fallbackDestinationImage}
            alt={destination.name}
            fill
            priority
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="flex items-center gap-1.5 text-xs text-zinc-500">
              <MapPinIcon className="size-3.5" />
              {destination.country}
            </p>

            <h1 className="font-heading mt-2 text-4xl font-normal text-neutral-900 sm:text-5xl">
              {destination.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-700">
              {destination.rating ? (
                <span className="flex items-center gap-1.5">
                  <StarIcon className="size-4 fill-brand text-brand" />
                  <span className="font-medium">
                    {destination.rating.toFixed(1)}
                  </span>
                  {destination.reviewCount ? (
                    <span className="text-xs text-zinc-400">
                      ({destination.reviewCount} reviews)
                    </span>
                  ) : null}
                </span>
              ) : null}

              <span className="flex items-center gap-1.5">
                <CalendarDaysIcon className="size-4 text-zinc-500" />
                {destination.duration}
              </span>

              {destination.category ? (
                <span className="flex items-center gap-1.5">
                  <TagIcon className="size-4 text-zinc-500" />
                  {destination.category}
                </span>
              ) : null}
            </div>

            <section className="mt-10">
              <h2 className="font-heading text-2xl font-normal text-neutral-900">
                Overview
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
                {destination.description}
              </p>
            </section>

            {destination.highlights ? (
              <section className="mt-8">
                <h2 className="font-heading text-2xl font-normal text-neutral-900">
                  Highlights
                </h2>
                <ul className="mt-4 grid max-w-2xl gap-x-8 gap-y-3 sm:grid-cols-2">
                  {destination.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2 text-sm text-neutral-700"
                    >
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <DestinationBookingCard destination={destination} />
        </div>
      </div>
    </main>
  )
}
