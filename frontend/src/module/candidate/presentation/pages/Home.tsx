import Header from "@/module/auth/presentation/pages/home/header"; 
import Hero from "@/module/auth/presentation/pages/home/Hero"; 
import Features from "@/module/auth/presentation/pages/home/TrustedCompanies"; 
import TrustedCompanies from "@/pages/landing/sections/TrustedCompanies";

const CandidateHome = () => {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <TrustedCompanies />
    </>
  );
};

export default CandidateHome;