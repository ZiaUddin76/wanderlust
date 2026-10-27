"use client"

import Image from "next/image"
import { StarIcon } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const testimonials = [
  {
    quote:
      "Wanderlust made our honeymoon absolutely perfect. Every detail was taken care of, from the flights to the little surprises along the way. We couldn't have asked for a better experience!",
    name: "Michael Chen",
    location: "Singapore",
    avatar: "/images/person2.png",
  },
  {
    quote:
      "An incredible trip from start to finish. The itinerary was well planned, the hotels were amazing, and the support team was always there whenever we needed something.",
    name: "Sarah Johnson",
    location: "New York, USA",
    avatar: "/images/person1.png",
  },
]

function Stars() {
  return (
    <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className="size-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Carousel className="w-full" opts={{ align: "start", loop: true }}>
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="font-heading text-4xl font-medium text-neutral-900 sm:text-5xl">
                What Travelers Say
              </h2>
              <p className="mt-4 text-sm text-neutral-500 sm:text-base">
                Real experiences from our happy travelers
              </p>
            </div>
            <div className="hidden shrink-0 items-center gap-3 sm:flex">
              <CarouselPrevious className="static my-0 size-10" />
              <CarouselNext className="static my-0 size-10" />
            </div>
          </div>

          <CarouselContent className="mt-14">
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.name}
                className="md:basis-1/2"
              >
                <div className="flex h-full flex-col rounded-2xl bg-sky-50/60 p-8 sm:p-10">
                  <Stars />
                  <p className="mt-5 flex-1 text-sm leading-relaxed text-neutral-600 sm:text-base">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={56}
                      height={56}
                      className="size-14 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-heading text-base font-medium text-neutral-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-8 flex items-center justify-center gap-3 sm:hidden">
            <CarouselPrevious className="static my-0 size-10" />
            <CarouselNext className="static my-0 size-10" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
