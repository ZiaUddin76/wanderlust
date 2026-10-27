"use client"

import { useState } from "react"
import { ArrowRightIcon, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Destination } from "@/lib/destinations"
import { authClient } from "@/lib/auth-client"

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

    const { data: session } = authClient.useSession();
    const user = session?.user;


    const [selectedDate, setSelectedDate] = useState(departureDate)

    const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const departureDate = formData.get("departureDate") as string

        const data = {
            username: user?.name,
            email: user?.email,
            image: user?.image,
            ...destination,
            departureDate,
            bookingDate: new Date()
        }

        // console.log(data)


        const res = await fetch('http://localhost:8000/booking', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const bookingRes = await res.json()
        console.log(bookingRes);

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
                        onChange={(event) => setSelectedDate(event.target.value)}
                        className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />

                    <p className="text-xs text-zinc-500">
                        Selected date: {formatDepartureDate(selectedDate)}
                    </p>
                </div>

                <Button
                    type="submit"
                    className="h-11 w-full gap-2 bg-brand text-sm font-semibold uppercase tracking-wide text-white hover:bg-brand/90"
                >
                    Book Now
                    <ArrowRightIcon className="size-4" />
                </Button>
            </form>
        </div>
    )
}

export default BookingCard