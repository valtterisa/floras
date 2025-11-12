"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import PromptTool from "@/components/interactive/prompt-tool";
import Pricing from "@/components/landing-page/pricing-section";
import { BenefitsGrid } from "@/components/landing-page/benefits-section";
import { FeaturesShowcase } from "@/components/landing-page/features-section";
import { ProcessDiagram } from "@/components/landing-page/process-diagram";
import { ComparisonTable } from "@/components/landing-page/comparison-section";
import { FinalCTA } from "@/components/landing-page/final-cta";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

interface LandingPageClientProps {
  initialUser: User | null;
}

export default function LandingPageClient({
  initialUser,
}: LandingPageClientProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);

    const supabase = createClient();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Only update on actual auth events, not on initial load
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        setUser(session?.user || null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Use server state until client is hydrated
  const currentUser = isClient ? user : initialUser;

  return (
    <>
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center relative"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(107, 114, 128, 0.2) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
          backgroundColor: "#ffffff",
        }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 text-center">
          Thanks for using Builddrr!
        </h1>
        <p className=" mt-5 text-lg text-gray-600 text-center">
          We are coming back soon with something new.
        </p>
        <p className=" mt-5 text-lg text-gray-600 text-center">
          -{" "}
          <a
            href="https://valtterisavonen.fi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            valtterisa
          </a>{" "}
          12.11.2025
        </p>
      </div>
      {/* <div className="relative">
                <Navbar user={currentUser?.user_metadata} />
                <PromptTool user={currentUser} />
            </div>
            <BenefitsGrid />
            <FeaturesShowcase />
            <ProcessDiagram />
            <ComparisonTable />
            <Pricing user={currentUser} />
            <FinalCTA />
            <Footer /> */}
    </>
  );
}
