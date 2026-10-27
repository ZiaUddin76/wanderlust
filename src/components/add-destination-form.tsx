"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SendIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  destinationCategories as categories,
  getErrorDescription,
} from "@/lib/destinations"

const fieldClass =
  "bg-slate-100 border-slate-200 px-3 placeholder:text-slate-400"

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/+$/, "")

export function AddDestinationForm() {
  const router = useRouter()
  const [category, setCategory] = React.useState("Beach")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // React clears event.currentTarget as soon as this async handler first
    // awaits, so keep a direct reference to the form element up front.
    const formElement = event.currentTarget
    const payload = Object.fromEntries(new FormData(formElement).entries())
    payload.category = category

    setIsSubmitting(true)

    try {
      const res = await fetch(`${apiBaseUrl}/add-destination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        toast.add({
          type: "error",
          title: "Failed to add travel package",
          description: await getErrorDescription(res),
        })
        return
      }

      toast.add({
        type: "success",
        title: "Travel package added",
        description: "Your new travel package has been created successfully.",
      })

      formElement.reset()
      setCategory("Beach")
    } catch {
      toast.add({
        type: "error",
        title: "Something went wrong",
        description: "Could not connect to the server. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCancel() {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <Card className="shadow-sm [--card-spacing:--spacing(8)]">
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="destination-name">Destination Name</Label>
            <Input
              id="destination-name"
              name="destinationName"
              placeholder="Bali Paradise"
              required
              className={fieldClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                placeholder="Indonesia"
                required
                className={fieldClass}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value ?? "Beach")}
              >
                <SelectTrigger id="category" className={fieldClass}>
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
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                step="0.01"
                placeholder="e.g. 1299"
                required
                className={fieldClass}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                placeholder="e.g., 7 Days/6 Nights"
                required
                className={fieldClass}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="departure-date">Departure Date</Label>
            <Input
              id="departure-date"
              name="departureDate"
              type="date"
              required
              className={fieldClass}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              required
              className={fieldClass}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the travel experience..."
              className={`${fieldClass} min-h-24`}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="gap-2 border-red-200 bg-white px-4 text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <XIcon />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-brand px-4 text-white hover:bg-brand/90"
            >
              {isSubmitting ? <Spinner /> : <SendIcon />}
              Add Travel Package
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
