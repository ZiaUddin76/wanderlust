import { Banner } from "@/components/banner"
import { WhyChoose } from "@/components/why-choose"
import { Testimonials } from "@/components/testimonials"
import { Cta } from "@/components/cta"


export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950">
      <Banner />
      <WhyChoose />
      <Testimonials />
      <Cta />
     
    </main>
  )
}
