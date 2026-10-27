import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

const searchFields = [
  { label: "Location", placeholder: "Address, City Or Zip" },
  { label: "Date/Duration", placeholder: "Anytime/3 Days" },
  { label: "Budget", placeholder: "$0-$3000" },
  { label: "People", placeholder: "5-10" },
]

export function Banner() {
  return (
    <section className="relative isolate flex min-h-[540px] flex-col overflow-hidden">
      <Image
        src="/images/Banner.png"
        alt=""
        fill
        priority
        sizes="(min-width: 1152px) 1152px, 100vw"
        className="object-cover"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-14 pb-12 text-center">
        <h1 className="text-6xl leading-tight font-light tracking-tight text-white sm:text-7xl">
          Discover Your
          <br />
          Next Adventure
        </h1>
        <p className="mt-4 max-w-xl text-sm text-white/90 sm:text-base">
          Explore breathtaking destinations and create unforgettable memories with
          <br className="hidden sm:block" /> our curated travel experiences.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/destinations"
            className="flex items-center gap-2 bg-brand px-6 py-3 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-brand/90 sm:text-sm"
          >
            Explore Now
            <ArrowRightIcon className="size-4" />
          </Link>
          <Link
            href="/destinations"
            className="bg-white/60 px-6 py-3 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-white/75 sm:text-sm"
          >
            View Destination
          </Link>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 divide-y divide-white/20 bg-white/40 backdrop-blur-sm sm:grid-cols-[1fr_1fr_1fr_1fr_auto] sm:divide-x sm:divide-y-0">
        {searchFields.map((field) => (
          <label
            key={field.label}
            className="flex cursor-text flex-col justify-center gap-0.5 px-5 py-3"
          >
            <span className="text-sm font-semibold text-white">
              {field.label}
            </span>
            <input
              type="text"
              placeholder={field.placeholder}
              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/70"
            />
          </label>
        ))}
        <button
          type="button"
          className="bg-brand px-10 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand/90 sm:px-12 sm:text-base"
        >
          Search
        </button>
      </div>
    </section>
  )
}
