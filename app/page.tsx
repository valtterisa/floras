import { MarketingLayout } from "@/components/site/marketing-layout";
import { Hero } from "@/components/landing/hero";
import { LogoWall } from "@/components/landing/logo-wall";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { CallToAction } from "@/components/landing/cta";

export default function LandingPage() {
  return (
    <MarketingLayout>
      <Hero />
      <LogoWall />
      <Features />
      <HowItWorks />
      <Pricing />
      <CallToAction />
    </MarketingLayout>
  );
}
