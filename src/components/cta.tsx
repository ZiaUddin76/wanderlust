import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

export function Cta() {
  return (
    <section className="relative isolate overflow-hidden bg-neutral-950 py-24 sm:py-32">
      <Image
        src="/images/CTA.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-neutral-950/70" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 text-center">
        <h2 className="font-heading text-4xl font-medium text-white sm:text-5xl">
          Ready To Start Your Journey?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm text-white/80 sm:text-base">
          Join thousands of satisfied travelers who have explored the world
          with us.
        </p>
        <Link
          href="/destinations"
          className="mt-10 inline-flex items-center gap-2 bg-brand px-8 py-4 text-sm font-semibold tracking-wider text-white uppercase transition-colors hover:bg-brand/90 sm:text-base"
        >
          Book Your Trip Today
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </section>
  )
}
