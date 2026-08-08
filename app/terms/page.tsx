import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Terms of Service — PMP Expert Tutor",
  description: "The terms governing your use of PMP Expert Tutor (pmpeco.com).",
  alternates: { canonical: "https://pmpeco.com/terms" },
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="8 August 2026">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of PMP Expert Tutor,
        available at <a href="https://pmpeco.com">pmpeco.com</a> (the &quot;Service&quot;). By creating
        an account or using the Service, you agree to these Terms. If you do not agree, do not use the Service.
      </p>

      <h2>1. The Service</h2>
      <p>
        PMP Expert Tutor is an online, bilingual (English and Arabic) preparation platform for the Project
        Management Professional (PMP)&reg; examination, aligned with the PMBOK&reg; Guide (8th Edition) and the
        PMP Examination Content Outline (ECO 2026). It provides study content, practice questions, an exam
        simulator, AI-assisted explanations, and readiness tracking.
      </p>

      <h2>2. No affiliation with PMI; no guarantee</h2>
      <p>
        PMP, PMBOK, and the PMI logo are registered marks of the Project Management Institute, Inc.
        (&quot;PMI&quot;). PMP Expert Tutor is an independent study aid and is <strong>not affiliated with,
        authorized, endorsed by, or sponsored by PMI</strong>. We do not guarantee that you will pass the PMP
        exam; outcomes depend on your own preparation and performance. AI-generated explanations are provided
        for study support and may contain errors — always verify against official sources.
      </p>

      <h2>3. Accounts</h2>
      <p>
        You must provide accurate information, keep your credentials secure, and are responsible for activity
        under your account. You must be at least 18 years old (or the age of majority in your jurisdiction).
      </p>

      <h2>4. Plans and payment</h2>
      <p>
        Access is sold as time-limited plans processed through PayPal. Purchasing a plan grants access for the
        stated period. Prices and inclusions are shown at checkout. Refunds are governed by our{" "}
        <a href="/refund">Refund Policy</a>.
      </p>

      <h2>5. Acceptable use</h2>
      <ul>
        <li>Do not share, resell, redistribute, or publish the content or your account access.</li>
        <li>Do not scrape, bulk-download, reverse-engineer, or programmatically access the Service or its APIs.</li>
        <li>Do not attempt to disrupt, overload, or gain unauthorized access to the Service.</li>
        <li>Use the Service for your own lawful, personal exam preparation only.</li>
      </ul>

      <h2>6. Intellectual property</h2>
      <p>
        All content, software, and materials on the Service are owned by us or our licensors and are protected
        by intellectual-property laws. Your plan grants a personal, non-transferable, revocable license to use
        the content for your own exam preparation. References to third-party works remain the property of their
        respective owners.
      </p>

      <h2>7. Disclaimers &amp; limitation of liability</h2>
      <p>
        The Service is provided &quot;as is&quot; without warranties of any kind. To the maximum extent
        permitted by law, we are not liable for any indirect, incidental, or consequential damages, and our
        total liability is limited to the amount you paid for the Service in the 3 months preceding the claim.
      </p>

      <h2>8. Termination</h2>
      <p>
        We may suspend or terminate access for breach of these Terms. You may stop using the Service at any time.
      </p>

      <h2>9. Changes</h2>
      <p>
        We may update these Terms; material changes will be reflected by the &quot;Last updated&quot; date.
        Continued use after changes constitutes acceptance.
      </p>

      <h2>10. Governing law &amp; contact</h2>
      <p>
        These Terms are governed by the laws of the Sultanate of Oman, without regard to conflict-of-law rules.
        Questions: <a href="mailto:support@pmpeco.com">support@pmpeco.com</a>.
      </p>
    </LegalShell>
  );
}
