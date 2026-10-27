import Image from "next/image"
import Link from "next/link"
import {
  ArrowUpRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react"

import type { Destination } from "@/lib/destinations"
import { fallbackDestinationImage } from "@/lib/destinations"

const imageSizes =
  "(min-width: 1024px) 384px, (min-width: 640px) 50vw, calc(100vw - 3rem)"

export function DestinationCard({ destination }: { destination: Destination }) {
  const image = destination.imageUrl || fallbackDestinationImage

  return (
    <article className="group">
      <Link
        href={`/destinations/${destination.id}`}
        className="block rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand/40"
      >
        <div className="relative aspect-video overflow-hidden rounded-lg bg-sky-50">
          <Image
            src={image}
            alt={destination.name}
            fill
            sizes={imageSizes}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {destination.rating ? (
            <span className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-semibold text-neutral-900 shadow-sm">
              {destination.rating.toFixed(1)}
              <StarIcon className="size-3 fill-neutral-900 text-neutral-900" />
            </span>
          ) : null}
        </div>

        <div className="mt-3">
          <p className="flex items-center gap-1 text-xs text-zinc-500">
            <MapPinIcon className="size-3.5" />
            {destination.country}
          </p>

          <div className="mt-1.5 flex items-baseline justify-between gap-3">
            <h3 className="text-base font-semibold text-neutral-900 transition-colors group-hover:text-brand">
              {destination.name}
            </h3>
            <p className="shrink-0">
              <span className="text-base font-semibold text-neutral-900">
                ${destination.price}
              </span>
              <span className="text-[11px] text-zinc-500">/Person</span>
            </p>
          </div>

          <p className="mt-1.5 flex items-center gap-1 text-xs text-zinc-500">
            <CalendarDaysIcon className="size-3.5" />
            {destination.duration}
          </p>

          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-brand uppercase transition-colors group-hover:text-brand/80">
            Book Now
            <ArrowUpRightIcon className="size-3.5" />
          </span>
        </div>
      </Link>
    </article>
  )
}
