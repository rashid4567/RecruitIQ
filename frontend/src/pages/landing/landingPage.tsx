
import Hero from "./sections/Hero"
import Features from "./sections/Feature"
import TrustedCompanies from "./sections/TrustedCompanies"
import CTA from "./sections/CTA"
import Header from "@/module/auth/pages/home/header"
import Footer from "./sections/Footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <TrustedCompanies />
      <CTA />
      <Footer/>
    </main>
  )
}
