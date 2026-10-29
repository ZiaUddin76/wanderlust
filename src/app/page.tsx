import { Banner } from "@/components/banner"
import { WhyChoose } from "@/components/why-choose"
import { Testimonials } from "@/components/testimonials"
import { Cta } from "@/components/cta"
import Featured from "@/components/featured"


export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950">
      <Banner />
      <Featured />
      <WhyChoose />
      <Testimonials />
      <Cta />
     
    </main>
  )
}
