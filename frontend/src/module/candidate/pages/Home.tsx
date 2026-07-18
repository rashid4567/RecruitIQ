import Header from "@/module/auth/pages/home/header"; 
import Hero from "../../../pages/landing/sections/Hero"; 
import Features from "../../../pages/landing/sections/Feature"
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