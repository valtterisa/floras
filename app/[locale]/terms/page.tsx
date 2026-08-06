import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms that govern your use of Floras.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" updated="August 3, 2026">
      <p>
        These Terms of Service (“Terms”) govern access to Floras, operated by
        TMI Valtteri Savonen (“Floras”, “we”, “us”). By creating an account or
        using the service you agree to these Terms. Contact:{" "}
        <a href="mailto:valtteri@quickshops.app">valtteri@quickshops.app</a>.
      </p>

      <h2>The service</h2>
      <p>
        Floras helps you generate Astro websites from natural-language prompts,
        with live sandbox previews. Features depend on your subscription.
      </p>

      <h2>Plans</h2>
      <ul>
        <li>
          <strong className="text-foreground">BYOK ($5/month)</strong> —
          sandbox preview and export. You supply your own Anthropic API key. No
          Floras hosting, floras.app publish, or custom domains.
        </li>
        <li>
          <strong className="text-foreground">Pro</strong> — platform AI credits
          (metered), preview, export, and Floras hosting on floras.app with
          optional custom domains.
        </li>
      </ul>
      <p>
        New accounts must subscribe before generating. Prices and included
        credits may change; changes apply on renewal unless stated otherwise.
      </p>

      <h2>BYOK responsibilities</h2>
      <p>
        On BYOK you are responsible for Anthropic account usage, billing, rate
        limits, and keeping your API key secure. Floras encrypts stored keys but
        cannot guarantee third-party model output or Anthropic availability.
      </p>

      <h2>Acceptable use</h2>
      <p>You may not use Floras to:</p>
      <ul>
        <li>Violate law or third-party rights</li>
        <li>Distribute malware, phishing, or abusive content</li>
        <li>Attempt to access other users’ data or infrastructure</li>
        <li>Abuse sandboxes, hosting, or AI quotas beyond fair use</li>
      </ul>

      <h2>Content and IP</h2>
      <p>
        You retain rights in prompts and materials you provide. Subject to these
        Terms and third-party model licenses, you may use and export generated
        site code for your projects. Floras may use anonymized operational data
        to run and improve the service.
      </p>
      <p>
        AI output may be inaccurate or non-unique. You are responsible for
        reviewing published content.
      </p>

      <h2>Subscriptions and cancellation</h2>
      <p>
        Subscriptions renew until cancelled through the billing portal. Fees
        already charged are generally non-refundable except where required by
        law. Cancelling stops future renewals; access continues until the end of
        the paid period unless we state otherwise.
      </p>

      <h2>Availability</h2>
      <p>
        The service is provided “as available.” We do not guarantee uptime,
        sandbox performance, or uninterrupted AI generation.
      </p>

      <h2>Disclaimer and liability</h2>
      <p>
        To the fullest extent permitted by law, Floras disclaims warranties of
        merchantability, fitness for a particular purpose, and non-infringement.
        Our aggregate liability arising from the service is limited to the
        amounts you paid us for Floras in the three months before the claim.
      </p>

      <h2>Termination</h2>
      <p>
        We may suspend or terminate accounts that violate these Terms or create
        risk to the service or other users.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these Terms. The “Last updated” date reflects the latest
        revision. Continued use after changes constitutes acceptance.
      </p>

      <h2>Governing law</h2>
      <p>
        These Terms are governed by the laws of Finland, without regard to
        conflict-of-law rules, unless mandatory consumer protections in your
        country apply.
      </p>
    </LegalPage>
  );
}
