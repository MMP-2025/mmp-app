import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const HomePageSkeleton: React.FC = () => (
  <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
    <div className="pt-2 space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-48" />
    </div>
    <Skeleton className="h-10 w-full rounded-lg" />
    <Skeleton className="h-24 w-full rounded-xl" />
    <Skeleton className="h-32 w-full rounded-xl" />
    <Skeleton className="h-20 w-full rounded-xl" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
    </div>
    <Skeleton className="h-24 w-full rounded-xl" />
  </div>
);

export const MoodTrackerSkeleton: React.FC = () => (
  <div className="space-y-6 max-w-4xl mx-auto">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-11 w-32 rounded-lg" />
    </div>
    <Skeleton className="h-10 w-full rounded-lg" />
    <div className="grid grid-cols-2 gap-3">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
    <Skeleton className="h-16 w-full rounded-xl" />
    <Skeleton className="h-12 w-full rounded-xl" />
  </div>
);

export const JournalSkeleton: React.FC = () => (
  <div className="space-y-6 max-w-4xl mx-auto">
    <div className="space-y-2">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-4 w-56" />
    </div>
    <Skeleton className="h-48 w-full rounded-xl" />
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-xl" />
      ))}
    </div>
  </div>
);

export const GenericPageSkeleton: React.FC = () => (
  <div className="space-y-6 max-w-4xl mx-auto">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
    <Skeleton className="h-10 w-full rounded-lg" />
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  </div>
);
