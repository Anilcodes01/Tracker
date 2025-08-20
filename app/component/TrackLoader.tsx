"use client";

import dynamic from 'next/dynamic';
import { LoaderCircle } from 'lucide-react';

const Tracker = dynamic(() => import('./Tracker'), { 
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-lg">
      <LoaderCircle className="animate-spin text-emerald-400" size={48} />
      <p>Loading Tracker...</p>
    </div>
  )
});

export default function TrackerLoader() {
  return <Tracker />;
}