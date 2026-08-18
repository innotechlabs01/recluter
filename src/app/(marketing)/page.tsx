import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Benefits } from '@/components/landing/benefits'
import { FAQ } from '@/components/landing/faq'
import { Payment } from '@/components/landing/payment'
import { Contact } from '@/components/landing/contact'

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Benefits />
      <FAQ />
      <Payment />
      <Contact />
    </>
  )
}
