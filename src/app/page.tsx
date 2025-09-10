'use client';

import { ReservationStatusView } from '@/features/reservations/components/ReservationStatusView';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <header className="w-full border-b">
        <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
          <div className="text-lg font-semibold">회의실 예약</div>
          <nav className="flex items-center gap-2">
            <Button asChild variant="secondary">
              <Link href="/lookup">예약 조회</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="py-6">
        <ReservationStatusView />
      </main>
    </div>
  );
}
