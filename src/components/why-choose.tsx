import Image from "next/image"

const features = [
  {
    icon: "/images/ShieldCheck.png",
    title: "Safe & Secure",
    description:
      "Your safety is our top priority. Travel with confidence knowing we follow the highest security standards.",
  },
  {
    icon: "/images/MapTrifold.png",
    title: "Expert Guides",
    description:
      "Our experienced local guides know the best spots and hidden gems to make your trip unforgettable.",
  },
  {
    icon: "/images/Headset.png",
    title: "24/7 Support",
    description:
      "Our dedicated support team is available around the clock to assist you whenever you need help.",
  },
]

export function WhyChoose() {
  return (
    <section className="bg-gradient-to-b from-sky-50 to-white py-20">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="text-center">
          <h2 className="font-heading text-4xl font-medium text-neutral-900 sm:text-5xl">
            Why Choose Wanderlust
          </h2>
          <p className="mt-4 text-sm text-neutral-500 sm:text-base">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_24px_rgba(21,161,191,0.10)] transition-shadow hover:shadow-[0_8px_32px_rgba(21,161,191,0.18)]"
            >
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-sky-50">
                <Image
                  src={feature.icon}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 object-contain"
                />
              </div>
              <h3 className="font-heading mt-6 text-xl font-medium text-neutral-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
