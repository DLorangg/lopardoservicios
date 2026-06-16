import LopardoLanding from "@/components/lopardo-landing"
import { ServicesSection } from "@/components/services-section"
import { BrandsSection } from "@/components/brands-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FooterSection } from "@/components/footer-section"

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen">
      <LopardoLanding />
      <ServicesSection />
      <BrandsSection />
      <TestimonialsSection />
      <FooterSection />
    </main>
  )
}
