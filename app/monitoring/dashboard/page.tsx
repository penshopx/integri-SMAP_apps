// app/monitoring/dashboard/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { DashboardContent } from './dashboard-content';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Dashboard Monitoring | IntegriGuide',
  description: 'Dashboard monitoring kepatuhan SMAP',
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Monitoring</h1>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}