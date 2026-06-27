import Header from "@/module/auth/pages/home/header"; 
import Hero from "@/module/auth/pages/home/Hero"; 
import Features from "@/module/auth/pages/home/TrustedCompanies"; 
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