'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function FormRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // This page exists just to trigger the parallel routes
    // The actual form is handled by @editor/page.tsx
    const type = searchParams.get('type');
    const jurisdiction = searchParams.get('jurisdiction');
    
    if (!type || !jurisdiction) {
      router.push('/documents/new');
    }
  }, [router, searchParams]);

  return null; // This component doesn't render anything
}