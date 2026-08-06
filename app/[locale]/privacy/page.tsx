import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Floras collects, uses, and stores your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="August 3, 2026">
      <p>
        This Privacy Policy describes how Floras (operated by TMI Valtteri
        Savonen, “we”, “us”) handles information when you use floras.app and
        related services. Contact:{" "}
        <a href="mailto:valtteri@quickshops.app">valtteri@quickshops.app</a>.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong className="text-foreground">Account data</strong> — email,
          name, and profile image (including from Google if you sign in with
          Google OAuth).
        </li>
        <li>
          <strong className="text-foreground">Billing data</strong> — plan and
          subscription status via Autumn and its payment processor. We do not
          store full card numbers on Floras servers.
        </li>
        <li>
          <strong className="text-foreground">BYOK API keys</strong> — if you
          use the BYOK plan, your Anthropic API key is stored encrypted at rest.
          We show only a short hint (last four characters). Plaintext keys are
          not returned to the browser after save.
        </li>
        <li>
          <strong className="text-foreground">Project content</strong> —
          prompts, chat messages, site plans, and generated site files in
          sandboxes.
        </li>
        <li>
          <strong className="text-foreground">Published sites</strong> — on
          Pro, published site metadata and hosting configuration for floras.app
          / custom domains.
        </li>
      </ul>

      <h2>How we use information</h2>
      <ul>
        <li>Provide generation, preview, export, billing, and support.</li>
        <li>
          Run AI generation with either Floras’ Anthropic account (Pro) or your
          Anthropic key (BYOK).
        </li>
        <li>Host published Pro sites and manage DNS/domain records.</li>
        <li>Secure the service, prevent abuse, and improve reliability.</li>
      </ul>

      <h2>Third parties</h2>
      <p>We rely on processors to run Floras, including:</p>
      <ul>
        <li>Convex (database and auth)</li>
        <li>Anthropic (AI models — platform or your BYOK key)</li>
        <li>box.ascii.dev / Box sandboxes (live preview VMs)</li>
        <li>Cloudflare (Pages hosting and DNS for published sites)</li>
        <li>Autumn (billing and subscriptions)</li>
        <li>Google (if you use Google sign-in)</li>
      </ul>
      <p>
        Their processing is governed by their own terms and privacy policies.
      </p>

      <h2>Retention</h2>
      <p>
        We keep account and project data while your account is active. You may
        request deletion by contacting us. Encrypted BYOK keys are removed when
        you delete the key or when we delete your account.
      </p>

      <h2>Security</h2>
      <p>
        We use encryption in transit (HTTPS) and encrypt BYOK API keys at rest.
        No method of transmission or storage is perfectly secure.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>Update profile and instructions in Account settings.</li>
        <li>Add, replace, or remove your Anthropic key on BYOK.</li>
        <li>Manage billing via the customer portal.</li>
        <li>Contact us to request account deletion.</li>
      </ul>

      <h2>Changes</h2>
      <p>
        We may update this policy. The “Last updated” date above reflects the
        latest revision. Continued use after changes means you accept the
        updated policy.
      </p>
    </LegalPage>
  );
}
