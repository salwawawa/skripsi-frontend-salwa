'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useBlocks } from '../../../../hooks/useBlocks';
import { Shop, Block } from '../../../../lib/types';

export default function BlockPage() {
  const params = useParams();
  const blockId = params.blockId as string;
  const { blocks, loading: blocksLoading, error: blocksError } = useBlocks();

  const [stores, setStores] = useState<Shop[]>([]);
  const [loadingStores, setLoadingStores] = useState<boolean>(false);
  const [errorStores, setErrorStores] = useState<string | null>(null);
  const [blockName, setBlockName] = useState<string>('');

  useEffect(() => {
    if (!blockId) return;

    // Find the block name and shops from the blocks array
    const block = blocks.find(b => b.id.toString() === blockId);
    console.log('Blocks:', blocks);
    console.log('Found block:', block);
    if (block) {
      setBlockName(block.nama);
      // @ts-ignore
      setStores(block.shops ?? []);
    } else {
      setStores([]);
    }
  }, [blockId, blocks]);

  if (blocksLoading || loadingStores) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600 mt-4">Memuat data...</span>
      </div>
    );
  }

  if (blocksError) {
    return (
      <div className="min-h-screen bg-white mx-auto py-8 px-4 text-center">
        <p className="text-red-600">Gagal memuat blok perumahan: {blocksError}</p>
      </div>
    );
  }

  if (errorStores) {
    return (
      <div className="min-h-screen bg-white mx-auto py-8 px-4 text-center">
        <p className="text-red-600">Gagal memuat toko: {errorStores}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6 px-4">
      <div className="mb-6">
        <Link href="/menu" className="text-green-600 hover:text-green-700 flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Kembali ke Menu
        </Link>
      </div>
      
      <h1 className="text-2xl font-semibold text-center text-green-600 mb-6">
        Kuliner {blockName}
      </h1>
      
      {stores.length > 0 ? (
        <div className="max-w-3xl mx-auto">
          {stores.map(store => (
            <Link href={`/stores/${store.id}`} key={store.id}>
              <div className="border rounded-md overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/3 relative w-32 h-32 flex justify-center mx-auto">
                    <Image 
                      src={store.foto ? (store.foto.startsWith('https') ? store.foto : `http://sentratamansari.com/${store.foto.startsWith('/') ? store.foto.slice(1) : store.foto}`) : '/assets/default-store.jpg'} 
                      alt={store.nama} 
                      fill 
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4 md:w-2/3">
                    <h3 className="text-lg font-semibold text-green-600">{store.nama}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1 mb-2">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 mr-1 text-green-600" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                        />
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                        />
                      </svg>
                      <span>{store.alamat}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{store.deskripsi}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          Tidak ada toko yang tersedia di blok ini.
        </p>
      )}
    </div>
  );
}
