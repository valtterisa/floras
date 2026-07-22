import { MarketingLayout } from "@/components/site/marketing-layout";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CallToAction } from "@/components/landing/cta";

export default function LandingPage() {
  return (
    <MarketingLayout>
      <Hero />
      <Features />
      <HowItWorks />
      <CallToAction />
    </MarketingLayout>
  );
}
