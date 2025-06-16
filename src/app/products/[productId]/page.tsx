'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProducts } from '../../../../hooks/useProducts';
import { useStores } from '../../../../hooks/useStores';
import { Product } from '../../../../lib/types';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const { fetchProduct, loading: productsLoading, error: productsError } = useProducts();
  const { stores, loading: storesLoading, error: storesError } = useStores();

  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    let isMounted = true;

    const loadProduct = async () => {
      try {
        setError(null);
        const data = await fetchProduct(productId);
        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Produk tidak ditemukan');
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  // Format price helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Function to get store name by ID
  const getStoreName = (storeId: string) => {
    const store = stores?.find(s => s.id === storeId);
    return store ? store.nama : 'Unknown Store';
  };

  // Function to handle view store
  const handleViewStore = () => {
    if (product?.shop_id) {
      window.location.href = `/stores/${product.shop_id}`;
    }
  };

  // Function to go back to previous page
  const handleGoBack = () => {
    window.history.back();
  };

  if (productsLoading || storesLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600 mt-4">Memuat produk...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white container mx-auto py-8 px-4 text-center">
        <p>{error || 'Produk tidak ditemukan.'}</p>
        <div className="flex space-x-4 justify-center mt-4">
          <button
            onClick={() => {
              if (product?.shop_id) {
                window.location.href = `/stores/${product.shop_id}`;
              }
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
          >
            Lihat Toko
          </button>
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:flex gap-8">
        {/* Product Image */}
        <div className="md:w-1/2 mb-6 md:mb-0 rounded-lg overflow-hidden">
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
            <Image 
              src={
                product.foto
                  ? product.foto.startsWith('https')
                    ? product.foto
                    : `https://sentratamansari.com/photos/${product.foto.startsWith('/') ? product.foto.slice(1) : product.foto}`
                  : 'http://localhost:3001/assets/default-food.jpg'
              }
              alt={product.nama}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'http://localhost:3001/assets/default-food.jpg';
              }}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <p className="text-green-600 font-semibold mb-2 uppercase tracking-wide">{getStoreName(product.shop_id)}</p>
          <h1 className="text-3xl font-extrabold mb-4 text-gray-900">{product.nama}</h1>
          <p className="text-gray-700 mb-6">{product.description || 'Deskripsi produk tidak tersedia.'}</p>
          <p className="text-2xl font-bold text-green-600 mb-6">{formatPrice(product.harga)}</p>
          <div className="flex gap-3">
            <button 
              onClick={handleViewStore}
              className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
            >
              Lihat Toko
            </button>
            <button 
              onClick={handleGoBack}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
