import Image from "next/image"
import Link from "next/link"
import { MailIcon, MapPinIcon, PhoneIcon, SendIcon } from "lucide-react"

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Destinations", href: "/destinations" },
  { label: "Tour Packages", href: "/packages" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

const support = [
  { label: "FAQ", href: "/faq" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Travel Insurance", href: "/insurance" },
]

const contact = [
  { icon: MapPinIcon, label: "123 Travel Street, New York, NY 10001" },
  { icon: PhoneIcon, label: "+1 (555) 123-4567" },
  { icon: MailIcon, label: "hello@wanderlast.com" },
]

const socials = [
  {
    label: "Facebook",
    href: "#",
    path: "M13.5 9H16V6h-2.5C11.6 6 10 7.6 10 9.5V11H8v3h2v7h3v-7h2.3l.4-3H13v-1.2c0-.5.2-.8.5-.8Z",
  },
  {
    label: "Twitter",
    href: "#",
    path: "M18.9 8.2c.5-.3.9-.8 1.1-1.3-.5.3-1 .5-1.6.6a2.2 2.2 0 0 0-3.8 1.5c0 .2 0 .3.1.5a6.3 6.3 0 0 1-4.6-2.3 2.2 2.2 0 0 0 .7 3 2.2 2.2 0 0 1-1-.3v.1c0 1.1.7 2 1.8 2.2-.2.1-.4.1-.6.1-.2 0-.3 0-.5-.1a2.2 2.2 0 0 0 2.1 1.5 4.5 4.5 0 0 1-3.3.9 6.3 6.3 0 0 0 9.7-5.6v-.3c.5-.3.9-.8 1.3-1.3Z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M12 7.6A4.4 4.4 0 1 0 12 16.4 4.4 4.4 0 0 0 12 7.6Zm0 7.2a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6Zm5.6-7.4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM16.4 4.4H7.6A3.2 3.2 0 0 0 4.4 7.6v8.8a3.2 3.2 0 0 0 3.2 3.2h8.8a3.2 3.2 0 0 0 3.2-3.2V7.6a3.2 3.2 0 0 0-3.2-3.2Zm1.6 12a1.6 1.6 0 0 1-1.6 1.6H7.6a1.6 1.6 0 0 1-1.6-1.6V7.6A1.6 1.6 0 0 1 7.6 6h8.8a1.6 1.6 0 0 1 1.6 1.6v8.8Z",
  },
]

export function Footer() {
  return (
    <footer className="bg-neutral-950 pt-16 text-neutral-400">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-10 pb-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div className="col-span-2 lg:col-span-1">
            <Image
              src="/images/Wanderlast-1.png"
              alt="Wanderlast"
              width={160}
              height={44}
              className="h-auto w-40 object-contain"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              Discover the world with unforgettable travel experiences crafted
              just for you.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4"
                    aria-hidden="true"
                  >
                    <path d={social.path} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-base font-medium text-white">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-base font-medium text-white">
              Support
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-heading text-base font-medium text-white">
              Newsletter
            </h3>
            <p className="mt-5 text-sm leading-relaxed">
              Subscribe to our newsletter for the latest travel deals and
              inspiration.
            </p>
            <form className="mt-5 flex overflow-hidden rounded-full bg-white/10">
              <input
                type="email"
                placeholder="Your email address"
                className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-neutral-500"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex size-10 shrink-0 items-center justify-center bg-brand text-white transition-colors hover:bg-brand/90"
              >
                <SendIcon className="size-4" />
              </button>
            </form>

            <ul className="mt-6 space-y-3 text-sm">
              {contact.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <item.icon className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs sm:flex-row">
          <p>© 2026 Wanderlast. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="transition-colors hover:text-brand">
              Terms of Service
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-brand">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
