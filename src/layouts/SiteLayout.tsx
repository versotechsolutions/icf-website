import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollManager } from '@/components/layout/ScrollManager';

export function SiteLayout() {
  return (
    // overflow-clip: cards entering from below the screen must not stretch the page while they rise in.
    <div className="flex min-h-dvh flex-col overflow-clip">
      <ScrollManager />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
