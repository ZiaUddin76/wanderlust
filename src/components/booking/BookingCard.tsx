"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRightIcon, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import {
    apiBaseUrl,
    getErrorDescription,
    type Destination,
} from "@/lib/destinations"
import { authClient } from "@/lib/auth-client"
import { getTokenFromClient } from "@/lib/getTokenFromClient"

interface BookingCardProps {
    destination: Destination
    departureDate: string
    onBookNow: () => void
}

function formatDepartureDate(value: string) {
    if (!value) return "Dates to be announced"

    const [year, month, day] = value.split("-")

    if (!year || !month || !day) return value

    return `${month}/${day}/${year}`
}

const BookingCard = ({
    destination,
    departureDate,
    onBookNow,
}: BookingCardProps) => {

    const router = useRouter()
    const { data: session } = authClient.useSession()
    const user = session?.user

    const [selectedDate, setSelectedDate] = useState(departureDate)
    const [isBooking, setIsBooking] = useState(false)

    const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // A booking without a signed-in email would never appear in
        // My Bookings, so ask the user to log in first.
        if (!user?.email) {
            toast.add({
                type: "info",
                title: "Please log in first",
                description: "You need an account before booking this travel package.",
            })
            onBookNow()
            router.push("/login")
            return
        }

        setIsBooking(true)

        const token = await getTokenFromClient()

        try {
            // The express backend ignores unknown fields, but keep the payload
            // clean instead of spreading Mongo internals such as `_id`.
            const res = await fetch(`${apiBaseUrl}/booking`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    destinationId: destination.id,
                    destinationName: destination.name,
                    imageUrl: destination.imageUrl,
                    price: destination.price,
                    departureDate: selectedDate,
                    username: user.name,
                    email: user.email,
                    image: user.image ?? "",
                    bookingDate: new Date().toISOString(),
                }),
            })

            if (!res.ok) {
                toast.add({
                    type: "error",
                    title: "Booking failed",
                    description: await getErrorDescription(res),
                })
                return
            }

            toast.add({
                type: "success",
                title: "Booking confirmed",
                description: `${destination.name} has been added to your bookings.`,
            })

            router.push("/my-bookings")
        } catch {
            toast.add({
                type: "error",
                title: "Booking failed",
                description: "Could not connect to the server. Please try again.",
            })
        } finally {
            setIsBooking(false)
        }
    }




    return (
        <div className="mt-5 space-y-4">
            <form onSubmit={handleBooking} className="space-y-4">
                <div className="space-y-2">
                    <label
                        htmlFor="departure-date"
                        className="flex items-center gap-2 text-sm font-medium text-zinc-700"
                    >
                        <CalendarIcon className="size-4" />
                        Departure Date
                    </label>

                    <input
                        id="departure-date"
                        name="departureDate"
                        type="date"
                        value={selectedDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(event) => setSelectedDate(event.target.value)}
                        className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />

                    <p className="text-xs text-zinc-500">
                        Selected date: {formatDepartureDate(selectedDate)}
                    </p>
                </div>

                <Button
                    type="submit"
                    disabled={isBooking}
                    className="h-11 w-full gap-2 bg-brand text-sm font-semibold uppercase tracking-wide text-white hover:bg-brand/90"
                >
                    {isBooking ? <Spinner /> : <ArrowRightIcon className="size-4" />}
                    {isBooking ? "Booking..." : "Book Now"}
                </Button>
            </form>
        </div>
    )
}

export default BookingCard
