import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Refund Policy — PMP Expert Tutor",
  description: "The refund terms for PMP Expert Tutor (pmpeco.com) plans.",
  alternates: { canonical: "https://pmpeco.com/refund" },
};

export default function RefundPage() {
  return (
    <LegalShell title="Refund Policy" updated="8 August 2026">
      <p>
        We want you to be confident in your purchase. This policy explains when and how you can request a refund
        for a PMP Expert Tutor plan.
      </p>

      <h2>1. 7-day money-back guarantee</h2>
      <p>
        You may request a full refund within <strong>7 days</strong> of your purchase, provided you have not
        substantially consumed the content — specifically, you have <strong>not completed more than 20%</strong>{" "}
        of the practice questions or lessons included in your plan. This gives you a genuine chance to evaluate
        the platform.
      </p>

      <h2>2. What is not refundable</h2>
      <ul>
        <li>Requests made more than 7 days after purchase.</li>
        <li>Plans where more than 20% of the included content has been completed.</li>
        <li>Accounts terminated for violating our <a href="/terms">Terms of Service</a> (e.g., sharing or reselling access).</li>
      </ul>

      <h2>3. How to request a refund</h2>
      <p>
        Email <a href="mailto:support@pmpeco.com">support@pmpeco.com</a> from the address on your account, with
        your receipt/order number and the reason for your request. We aim to respond within 2 business days.
      </p>

      <h2>4. How refunds are processed</h2>
      <p>
        Approved refunds are issued to your original PayPal payment method. Once processed, the associated plan
        access is revoked. Depending on PayPal, it may take a few business days for the funds to appear.
      </p>

      <h2>5. Questions</h2>
      <p>
        For anything about billing or refunds, contact{" "}
        <a href="mailto:support@pmpeco.com">support@pmpeco.com</a>.
      </p>
    </LegalShell>
  );
}
