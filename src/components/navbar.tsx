"use client"
import Image from "next/image"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"



const primaryLinks = [
  { href: "/", label: "Home", active: true },
  { href: "/destinations", label: "Destinations" },
  { href: "/add-destination", label: "Add Destination", active: false },
  { href: "/my-bookings", label: "My Bookings" },
]

const accountLinks = [
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign Up" },
]

export function Navbar() {


  const {
    data: session,
    isPending, //loading state
  } = authClient.useSession()


  const user = session?.user;


  const handleSignout = () => {
    authClient.signOut();
  }


  // console.log(user);


  return (
    <header className="grid h-14 grid-cols-[1fr_auto_1fr] items-center bg-white px-6">
      <nav className="hidden items-center gap-5 md:flex" aria-label="Primary">
        {primaryLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              link.active
                ? "text-sm font-medium text-brand transition-colors hover:text-brand/80"
                : "text-sm font-medium text-zinc-800 transition-colors hover:text-brand"
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link href="/" className="justify-self-center" aria-label="Wanderlast home">
        <Image
          src="/images/Wanderlast.png"
          alt="Wanderlast"
          width={162}
          height={24}
          className="h-5 w-auto"
        />
      </Link>

      <nav className="flex items-center justify-end gap-5" aria-label="Account">

        {
          // Avoid flashing the Login/Sign Up links while the session is loading.
          isPending ? null : user ? <Popover>
            <PopoverTrigger
              render={
                <button type="button" aria-label="Open account menu">
                  <Avatar>
                    <AvatarImage
                      referrerPolicy="no-referrer"
                      src={user?.image as string}
                    />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </button>
              }
            >
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>{user?.name}</PopoverTitle>
                <PopoverDescription>
                  {user?.email}
                </PopoverDescription>

                <Button onClick={handleSignout} variant="destructive">
                  SignOut
                </Button>
              </PopoverHeader>
            </PopoverContent>
          </Popover> : <>
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-zinc-800 transition-colors hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </>
        }



      </nav>
    </header>
  )
}
