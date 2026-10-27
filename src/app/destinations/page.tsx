import { DestinationsExplorer } from "@/components/destinations-explorer"
import { getDestinations } from "@/lib/destinations"

export const dynamic = "force-dynamic"

export default async function AllDestinationsPage() {
  const destinations = await getDestinations()

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-white">
      {destinations === null ? (
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
          <h1 className="font-heading text-4xl font-normal text-neutral-900">
            Explore All Destinations
          </h1>
          <p className="max-w-md text-sm text-neutral-500">
            We could not reach the travel server right now. Please try again in
            a moment.
          </p>
        </div>
      ) : (
        <DestinationsExplorer destinations={destinations} />
      )}
    </main>
  )
}
