import React from "react";
import Header from "./components/site-components/header";
import Footer from "./components/site-components/footer";
import Hero from "./components/site-components/hero";
import TeamSection from "./components/site-components/team-section";
import Testimonials from "./components/site-components/testimonials";
import FAQSection from "./components/site-components/faq-section";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow pt-16"> {/* Add padding to account for fixed header */}
        <Hero />
        <TeamSection />
        <Testimonials />
        <FAQSection />
      </div>
      <Footer />
    </main>
  );
}