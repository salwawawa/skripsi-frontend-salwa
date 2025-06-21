import React, { Suspense } from 'react';
import SearchPageClient from '../search/SearchPageClient';

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
