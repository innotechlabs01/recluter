import { Hero } from '@/components/landing/hero'
import { TrustLogos } from '@/components/landing/trust-logos'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Metrics } from '@/components/landing/metrics'
import { Benefits } from '@/components/landing/benefits'
import { Testimonials } from '@/components/landing/testimonials'
import { FAQ } from '@/components/landing/faq'
import { Payment } from '@/components/landing/payment'
import { FinalCTA } from '@/components/landing/final-cta'
import { Contact } from '@/components/landing/contact'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustLogos />
      <HowItWorks />
      <Metrics />
      <Benefits />
      <Testimonials />
      <FAQ />
      <Payment />
      <FinalCTA />
      <Contact />
    </>
  )
}
