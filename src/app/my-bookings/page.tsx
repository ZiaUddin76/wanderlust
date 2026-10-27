import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { BookingListCard } from '@/components/booking/booking-list-card';
import { getBookingsByEmail } from '@/lib/bookings';

export const dynamic = 'force-dynamic';

const MyBookingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    redirect('/signin');
  }

  const bookings = await getBookingsByEmail(user.email);

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-white">
      <section className="mx-auto w-full max-w-7xl px-6 py-12">
        <h1 className="font-heading text-4xl font-normal text-neutral-900">
          My Bookings
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Manage and view your upcoming travel plans
        </p>

        {bookings === null ? (
          <div className="mt-12 rounded-lg border border-zinc-200 bg-white px-6 py-16 text-center">
            <h2 className="font-heading text-2xl font-normal text-neutral-900">
              We could not load your bookings
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              The travel server may be offline. Please try again in a moment.
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="mt-12 rounded-lg border border-zinc-200 bg-white px-6 py-16 text-center">
            <h2 className="font-heading text-2xl font-normal text-neutral-900">
              No bookings yet
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              You have not booked any travel plans. Explore our destinations to
              plan your next trip.
            </p>
            <Link
              href="/destinations"
              className="mt-6 inline-flex h-10 items-center rounded-lg bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
            >
              Explore Destinations
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-6">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="group"
              >
                <BookingListCard booking={booking} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default MyBookingsPage;
