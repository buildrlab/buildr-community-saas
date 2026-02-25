'use client';

import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-3xl border border-brand-700/20 bg-white/80 p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-brand-900">Dashboard unavailable</h2>
        <p className="mt-3 text-slate-700">{error.message}</p>
        <Button className="mt-6" onClick={() => reset()}>
          Retry
        </Button>
      </div>
    </div>
  );
}
