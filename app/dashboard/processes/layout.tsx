import { requirePremium } from '@/lib/auth/access';

export default async function PaidLayout({ children }: { children: React.ReactNode }) {
  await requirePremium();
  return <>{children}</>;
}
