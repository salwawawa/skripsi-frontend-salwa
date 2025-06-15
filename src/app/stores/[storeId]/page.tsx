'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useStores } from '../../../../hooks/useStores';
import { useProducts } from '../../../../hooks/useProducts';
import { Product, Shop } from '../../../../lib/types';
import Link from 'next/link';

export default function StoreDetailPage() {
  const params = useParams();
  const storeId = params.storeId as string;

  const { loading: storesLoading, error: storesError, fetchStore } = useStores();
  const { fetchProducts, loading: productsLoading, error: productsError, products } = useProducts();

  const [store, setStore] = useState<Shop | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!storeId) return;

    const loadStoreAndProducts = async () => {
      try {
        setError(null);
        const storeData = await fetchStore(storeId);
        setStore(storeData);
        await fetchProducts();
      } catch (err) {
        setError('Gagal memuat data toko');
      }
    };

    loadStoreAndProducts();
  }, [storeId]);

  useEffect(() => {
    if (storeId && products.length > 0) {
      const filtered = products.filter(product => product.shop_id.toString() === storeId);
      setFilteredProducts(filtered);
    }
  }, [storeId, products]);

  if (storesLoading || productsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600 mt-4">Memuat data toko...</span>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-white mx-auto py-8 px-4 text-center text-black">
        <p>{error || 'Toko tidak ditemukan.'}</p>
        <Link href="/" className="text-green-600 hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mx-auto py-6 px-4">
      <button
        onClick={() => window.history.back()}
        className="mb-4 text-green-600 hover:text-green-700 font-semibold flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>
      {/* Store Profile as Page Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="w-48 h-44 rounded-lg overflow-hidden border border-gray-300 shadow-md flex-shrink-0">
          <Image
            src={
              store.foto
                ? store.foto.startsWith('http')
                  ? store.foto
                  : `http://localhost:3001/${store.foto.startsWith('/') ? store.foto.slice(1) : store.foto}`
                : 'http://localhost:3001/assets/default-store.jpg'
            }
            alt={store.nama ?? 'Store Logo'}
            width={192}
            height={192}
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">{store.nama}</h1>
          <p className="text-green-600 font-semibold mb-1">Pemilik: {store.pemilik}</p>
          <p className="text-gray-700 mb-4">Alamat: {store.alamat}</p>
          <p className="text-gray-700">{store.deskripsi || 'Deskripsi toko tidak tersedia.'}</p>
        </div>
      </div>

      {/* Products Grid Below */}
      <div>
        <h2 className="text-2xl text-black font-bold mb-4">Produk dari Toko Ini</h2>
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500">Belum ada produk yang tersedia.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-full h-40">
                    <Image
                      src={
                        product.foto
                          ? product.foto.startsWith('http')
                            ? product.foto
                            : `http://localhost:3001/${product.foto.startsWith('/') ? product.foto.slice(1) : product.foto}`
                          : 'http://localhost:3001/assets/default-food.jpg'
                      }
                      alt={product.nama}
                      layout="fill"
                      objectFit="cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'http://localhost:3001/assets/default-food.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-lg mb-2 text-black">{product.nama}</h3>
                    <p className="text-green-600 font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.harga)}</p>
                    <Link href={`/products/${product.id}`} className="inline-block mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
