import { AddDestinationForm } from "@/components/add-destination-form"



export default function AddDestinationPage() {
  return (
    <main className="flex min-h-screen flex-1 flex-col bg-white">
      <div className="mx-auto w-full max-w-7xl flex-1 px-6 pt-16 pb-14">
        <h1 className="font-heading text-4xl font-medium text-neutral-900 sm:text-5xl">
          Add New Travel Package
        </h1>
        <div className="mx-auto mt-12 w-full max-w-3xl">
          <AddDestinationForm />
        </div>
      </div>
    </main>
  )
}
