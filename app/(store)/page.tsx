import { Suspense } from 'react';
import LandingPage from './landing/page';

export default function HomePage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black" />}>
      <LandingPage />
    </Suspense>
  );
}
