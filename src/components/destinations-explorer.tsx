"use client"

import * as React from "react"

import { DestinationCard } from "@/components/destination-card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Destination } from "@/lib/destinations"

const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "under-500", label: "Under $500" },
  { value: "500-1000", label: "$500 - $1,000" },
  { value: "1000-2500", label: "$1,000 - $2,500" },
  { value: "over-2500", label: "$2,500+" },
]

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Top Rated" },
  { value: "name-asc", label: "Name: A to Z" },
]

// Maps of value → label so `<Select.Value>` renders the label (rather than
// the raw value) even before the portalled popup has mounted.
const priceRangeItems = Object.fromEntries(
  priceRanges.map((range) => [range.value, range.label]),
)

const sortItems = Object.fromEntries(
  sortOptions.map((option) => [option.value, option.label]),
)

const triggerClass =
  "h-11 w-full justify-between rounded-lg border-zinc-200 px-4 text-sm uppercase tracking-wide text-zinc-500"

function matchesPriceRange(price: number, range: string | null) {
  switch (range) {
    case "under-500":
      return price < 500
    case "500-1000":
      return price >= 500 && price < 1000
    case "1000-2500":
      return price >= 1000 && price < 2500
    case "over-2500":
      return price >= 2500
    default:
      return true
  }
}

export function DestinationsExplorer({
  destinations,
}: {
  destinations: Destination[]
}) {
  // `null` means "not chosen yet" so the trigger shows its placeholder,
  // matching the unselected look of the design.
  const [category, setCategory] = React.useState<string | null>(null)
  const [priceRange, setPriceRange] = React.useState<string | null>(null)
  const [sortBy, setSortBy] = React.useState<string | null>(null)

  const categories = Array.from(
    new Set(destinations.map((item) => item.category).filter(Boolean)),
  ).sort()

  const categoryItems: Record<string, string> = { all: "All Categories" }
  for (const item of categories) {
    categoryItems[item] = item
  }

  const visible = destinations
    .filter(
      (item) =>
        (category === null || item.category === category) &&
        matchesPriceRange(item.price, priceRange),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "rating-desc":
          return (b.rating ?? 0) - (a.rating ?? 0)
        case "name-asc":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const hasActiveFilters = category !== null || priceRange !== null

  function resetFilters() {
    setCategory(null)
    setPriceRange(null)
    setSortBy(null)
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pt-14 pb-20">
      <h1 className="font-heading text-4xl font-normal text-neutral-900 sm:text-5xl">
        Explore All Destinations
      </h1>
      <p className="mt-3 text-sm text-neutral-500 sm:text-base">
        Find your perfect travel experience from our curated collection
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Select items={categoryItems} value={category} onValueChange={setCategory}>
          <SelectTrigger className={triggerClass}>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={priceRangeItems}
          value={priceRange}
          onValueChange={setPriceRange}
        >
          <SelectTrigger className={triggerClass}>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select items={sortItems} value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className={triggerClass}>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="mt-4 text-sm text-neutral-500">
        Showing {visible.length} destination{visible.length === 1 ? "" : "s"}
      </p>

      {visible.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="font-heading text-2xl text-neutral-900">
            No destinations found
          </p>
          <p className="max-w-md text-sm text-neutral-500">
            We could not find any travel packages matching your filters. Try
            widening your search.
          </p>
          {hasActiveFilters ? (
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              className="border-zinc-200 bg-white px-4 text-neutral-700 hover:bg-zinc-50"
            >
              Clear filters
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((destination) => (
            <DestinationCard
              key={destination.id || destination.name}
              destination={destination}
            />
          ))}
        </div>
      )}
    </section>
  )
}
