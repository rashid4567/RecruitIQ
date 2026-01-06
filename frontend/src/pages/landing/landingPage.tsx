import Header from "./sections/Header"
import Hero from "./sections/Hero"
import Features from "./sections/Feature"
import TrustedCompanies from "./sections/TrustedCompanies"
import CTA from "./sections/CTA"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <TrustedCompanies />
      <CTA />
    </main>
  )
}
