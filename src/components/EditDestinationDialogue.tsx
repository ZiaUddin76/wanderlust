"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PencilIcon, SendIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import {
  updateDestination,
  destinationCategories as categories,
  type Destination,
} from "@/lib/destinations"
import { getTokenFromClient } from "@/lib/getTokenFromClient"

const fieldClass =
  "bg-slate-100 border-slate-200 px-3 placeholder:text-slate-400"

export function EditDestinationDialog({
  destination,
}: {
  destination: Destination
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [category, setCategory] = React.useState(destination.category)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    // The popup unmounts while closed, so its inputs re-mount with the saved
    // values — reset the (stateful) select to match the record again.
    if (nextOpen) {
      setCategory(destination.category || "Beach")
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // React clears event.currentTarget as soon as this async handler first
    // awaits, so keep a direct reference to the form element up front.
    const formElement = event.currentTarget
    const payload = Object.fromEntries(new FormData(formElement).entries())
    payload.category = category

    const token = await getTokenFromClient()

    setIsSubmitting(true)

    const result = await updateDestination(destination.id, payload, token)

    setIsSubmitting(false)

    if (!result.ok) {
      toast.add({
        type: "error",
        title: "Failed to update travel package",
        description: result.description,
      })
      return
    }

    toast.add({
      type: "success",
      title: "Travel package updated",
      description: "Your changes have been saved successfully.",
    })

    setOpen(false)
    // The details page is server-rendered from the backend — refetch it so
    // the page shows the saved values.
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" className="px-4" />}>
        <PencilIcon className="size-4" />
        Edit
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit travel package</DialogTitle>
          <DialogDescription>
            Update the details of this destination, then save your changes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-destination-name">Destination Name</Label>
            <Input
              id="edit-destination-name"
              name="destinationName"
              defaultValue={destination.name}
              placeholder="Bali Paradise"
              required
              className={fieldClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-country">Country</Label>
              <Input
                id="edit-country"
                name="country"
                defaultValue={destination.country}
                placeholder="Indonesia"
                required
                className={fieldClass}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value ?? "Beach")}
              >
                <SelectTrigger id="edit-category" className={fieldClass}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Price (USD)</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                min={0}
                step="0.01"
                defaultValue={destination.price || undefined}
                placeholder="e.g. 1299"
                required
                className={fieldClass}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-duration">Duration</Label>
              <Input
                id="edit-duration"
                name="duration"
                defaultValue={destination.duration}
                placeholder="e.g., 7 Days/6 Nights"
                required
                className={fieldClass}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-departure-date">Departure Date</Label>
            <Input
              id="edit-departure-date"
              name="departureDate"
              type="date"
              // `departureDate` may be a full ISO timestamp; `<input
              // type="date">` expects just the `yyyy-mm-dd` part.
              defaultValue={
                destination.departureDate
                  ? destination.departureDate.slice(0, 10)
                  : ""
              }
              required
              className={fieldClass}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-image-url">Image URL</Label>
            <Input
              id="edit-image-url"
              name="imageUrl"
              type="url"
              defaultValue={destination.imageUrl}
              placeholder="https://example.com/image.jpg"
              required
              className={fieldClass}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              name="description"
              defaultValue={destination.description}
              placeholder="Describe the travel experience..."
              className={`${fieldClass} min-h-24`}
            />
          </div>

          <div className="flex justify-end gap-3">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  className="gap-2 border-red-200 bg-white px-4 text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                />
              }
            >
              <XIcon className="size-4" />
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-brand px-4 text-white hover:bg-brand/90"
            >
              {isSubmitting ? <Spinner /> : <SendIcon className="size-4" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
