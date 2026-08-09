import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy — PMPeco",
  description: "How PMPeco (pmpeco.com) collects, uses, and protects your data.",
  alternates: { canonical: "https://pmpeco.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="8 August 2026">
      <p>
        This Privacy Policy explains how PMPeco (<a href="https://pmpeco.com">pmpeco.com</a>) collects,
        uses, and safeguards your information when you use the Service.
      </p>

      <h2>1. Information we collect</h2>
      <ul>
        <li><strong>Account data</strong> — your name and email address when you register.</li>
        <li><strong>Usage data</strong> — your practice results, progress, readiness metrics, and interactions with study features, so we can personalize and track your preparation.</li>
        <li><strong>Payment data</strong> — payments are processed by PayPal. We receive a transaction confirmation and receipt details; <strong>we do not collect or store your card or bank details.</strong></li>
        <li><strong>Technical data</strong> — basic log/device information for security and reliability.</li>
      </ul>

      <h2>2. How we use your data</h2>
      <ul>
        <li>To provide, personalize, and improve the Service.</li>
        <li>To process purchases and issue receipts.</li>
        <li>To communicate with you about your account and support requests.</li>
        <li>To secure the Service and prevent abuse.</li>
      </ul>
      <p>We do not sell your personal data.</p>

      <h2>3. Service providers we share data with</h2>
      <p>We use trusted processors to run the Service; they access data only to perform their functions:</p>
      <ul>
        <li><strong>Supabase</strong> — database, authentication, and file storage.</li>
        <li><strong>Vercel</strong> &amp; <strong>Cloudflare</strong> — hosting, content delivery, and security.</li>
        <li><strong>PayPal</strong> — payment processing.</li>
        <li><strong>Anthropic (Claude)</strong> — AI-generated explanations and tutoring responses.</li>
        <li><strong>ElevenLabs</strong> — optional text-to-speech audio.</li>
      </ul>
      <p>
        When you use AI features, the relevant prompt/content is sent to the AI provider to generate a response.
        Do not enter sensitive personal information into AI chat.
      </p>

      <h2>4. Cookies</h2>
      <p>
        We use essential cookies for authentication (keeping you signed in) and to remember your language
        preference. We do not use them for third-party advertising.
      </p>

      <h2>5. Data retention</h2>
      <p>
        We keep your data while your account is active and as needed to provide the Service, comply with legal
        obligations, and resolve disputes. You may request deletion at any time (see below).
      </p>

      <h2>6. Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data, and you may withdraw consent
        or object to certain processing. To exercise these rights, email{" "}
        <a href="mailto:support@pmpeco.com">support@pmpeco.com</a>.
      </p>

      <h2>7. International transfers</h2>
      <p>
        Our providers may process data in countries other than yours. Where required, appropriate safeguards are
        applied to protect your information.
      </p>

      <h2>8. Children</h2>
      <p>The Service is not intended for anyone under 18, and we do not knowingly collect their data.</p>

      <h2>9. Changes &amp; contact</h2>
      <p>
        We may update this Policy; changes are reflected by the &quot;Last updated&quot; date. Questions or
        requests: <a href="mailto:support@pmpeco.com">support@pmpeco.com</a>.
      </p>
    </LegalShell>
  );
}
