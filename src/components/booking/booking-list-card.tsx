"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  Clock3Icon,
  EyeIcon,
  HashIcon,
  Trash2Icon,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { formatBookingDate, cancelBooking, type Booking, type BookingStatus } from "@/lib/bookings"

const statusMeta: Record<
  BookingStatus,
  { label: string; icon: typeof CheckCircle2Icon; className: string }
> = {
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2Icon,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  pending: {
    label: "Pending",
    icon: Clock3Icon,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
}

export function BookingListCard({ booking }: { booking: Booking }) {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const meta = statusMeta[booking.status]
  const StatusIcon = meta.icon

  const handleCancel = async () => {
    setIsCancelling(true)

    const result = await cancelBooking(booking.id)

    setIsCancelling(false)

    if (!result.ok) {
      toast.add({
        type: "error",
        title: "Failed to cancel booking",
        description: result.description,
      })
      return
    }

    setConfirmOpen(false)

    toast.add({
      type: "success",
      title: "Booking cancelled",
      description: `${booking.name} has been cancelled successfully.`,
    })

    router.refresh()
  }

  return (
    <article className="grid gap-5 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 sm:grid-cols-[minmax(0,16rem)_1fr] sm:p-5">
      <div className="relative h-40 overflow-hidden rounded-md bg-sky-50 sm:h-full sm:min-h-36">
        {booking.imageUrl ? (
          <Image
            src={booking.imageUrl}
            alt={booking.name}
            fill
            sizes="(min-width: 640px) 256px, calc(100vw - 3rem)"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <Badge
          className={`w-fit border px-2.5 py-1 ${meta.className}`}
          aria-label={`Booking status: ${meta.label}`}
        >
          <StatusIcon className="size-3.5" />
          {meta.label}
        </Badge>

        <h3 className="truncate font-heading text-2xl font-normal text-neutral-900">
          {booking.name}
        </h3>

        <p className="flex items-center gap-1.5 text-xs text-zinc-500">
          <CalendarDaysIcon className="size-3.5 shrink-0" />
          <span>
            Departure:{" "}
            <time dateTime={booking.departureDate}>
              {formatBookingDate(booking.departureDate)}
            </time>
          </span>
        </p>

        <p className="flex items-center gap-1.5 text-xs text-zinc-500">
          <HashIcon className="size-3.5 shrink-0" />
          <span className="truncate">Booking ID: {booking.id}</span>
        </p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
          <p className="text-2xl font-bold text-brand">${booking.price}</p>

          <div className="flex gap-2">
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger
                render={<button type="button" className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-destructive px-3 text-sm font-medium text-destructive-foreground shadow-xs hover:bg-destructive/90 disabled:pointer-events-none disabled:opacity-50" />}
              >
                <Trash2Icon className="size-3.5" />
                Cancel
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-red-50 text-red-500">
                    <Trash2Icon />
                  </AlertDialogMedia>
                  <AlertDialogTitle>
                    Cancel this booking?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Your booking for{" "}
                    {booking.name} will be permanently removed from the server.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isCancelling}>
                    Keep Booking
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="gap-2 bg-red-600 text-white hover:bg-red-700"
                  >
                    {isCancelling ? (
                      <Spinner className="text-white" />
                    ) : (
                      <Trash2Icon className="size-4" />
                    )}
                    {isCancelling ? "Cancelling..." : "Cancel Booking"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Link
              href={`/destinations/${booking.destinationId}`}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-brand px-3 text-sm font-medium text-white shadow-xs hover:bg-brand/90"
            >
              <EyeIcon className="size-3.5" />
              View
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
