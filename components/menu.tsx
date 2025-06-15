
'use client';

import Link from 'next/link';
import { useBlocks } from '../hooks/useBlocks';

const Menu = () => {
  const { blocks, loading, error } = useBlocks();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600 mt-4">Memuat blok perumahan...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-center p-6">
        <p className="text-red-600">Gagal memuat blok perumahan: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-center p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-8">Mau jajan dimana hari ini?</h1>
      <div className="grid gap-4 max-w-xl mx-auto">
        {blocks.map((block) => (
          <Link 
            href={`/blocks/${block.id}`} 
            key={block.id}
            className="block border rounded-md p-4 text-center text-green-600 hover:bg-green-50 transition-colors"
          >
            {block.nama}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Menu;
