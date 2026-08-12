import { requireTier } from '@/lib/auth/access';

export default async function GatedLayout({ children }: { children: React.ReactNode }) {
  await requireTier('professional');
  return <>{children}</>;
}
