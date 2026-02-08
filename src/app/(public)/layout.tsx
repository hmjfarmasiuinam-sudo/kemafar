import { FloatingDock } from '@/shared/components/layout/FloatingDock';
import { Footer } from '@/shared/components/layout/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="min-h-screen">{children}</main>
      <FloatingDock />
      <Footer />
    </>
  );
}
