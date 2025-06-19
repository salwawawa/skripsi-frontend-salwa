'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useProducts } from '../../hooks/useProducts'; // Sesuaikan path
import { useStores } from '../../hooks/useStores'; // Sesuaikan path
import { useCategories } from '../../hooks/useCategories'; // Import useCategories hook
import { Product } from '../../lib/types';
import { useRouter } from 'next/navigation';


const HomePage: React.FC = () => {
  const router = useRouter();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { stores, loading: storesLoading, error: storesError } = useStores();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories(); // Use categories hook

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  // Function to handle navigation to product detail page
  const handleViewDetail = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  // Function to get store name by ID
  const getStoreName = (storeId: string) => {
    const store = stores?.find(s => s.id === storeId);
    return store ? store.nama : 'Unknown Store';
  };

  // Format price helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Function to generate image URL with cache busting
  const getImageUrl = (product: Product) => {
    if (!product.foto) {
      return 'http://localhost:3001/assets/default-food.jpg';
    }
    
    const baseUrl = product.foto.startsWith('https') 
      ? product.foto
      : `https://sentratamansari.com/${product.foto.startsWith('/') ? product.foto.slice(1) : product.foto}`;
    
    // Tambahkan cache buster berdasarkan updatedAt atau fallback ke timestamp
    const cacheBuster = product.updatedAt 
      ? `?v=${new Date(product.updatedAt).getTime()}`
      : `?v=${Date.now()}`;
    
    return baseUrl + cacheBuster;
  };

  // Shuffle function (Fisher-Yates)
  const shuffleArray = (array: Product[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Update recommendedProducts based on selectedCategoryId and products
  useEffect(() => {
    if (products && Array.isArray(products)) {
      if (selectedCategoryId === null) {
        setRecommendedProducts(shuffleArray(products));
      } else {
        setRecommendedProducts(shuffleArray(products.filter(p => p.category_id === selectedCategoryId)));
      }
    } else {
      setRecommendedProducts([]);
    }
  }, [products, selectedCategoryId]);

  return (
    <>
      <Head>
        <title>Sentra Tamansari</title>
        <meta name="description" content="Restoran Kuliner Tamansari" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Hero Image */}
        <div className="flex justify-center px-4 mb-4 mt-8">
          <div className="w-full max-w-2xl h-30 overflow-hidden relative rounded-xl">
            <Image
              src="/assets/header.png"
              alt="Kuliner Tamansari Spread"
              layout="fill"
              objectFit="cover"
              priority
              className="absolute top-0 left-0"
            />
          </div>
        </div>

        {/* Recommended Menu Section */}
        <div className="flex flex-col items-center py-4">
          <h2 className="text-2xl font-extrabold mb-6 text-center text-black">
            Menu Rekomendasi Hari Ini
          </h2>

        {/* Category Buttons */}
        <div className="flex justify-center space-x-4 mb-6 px-4 flex-wrap">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-3 py-1.5 rounded-full border transition-colors duration-300 ${
              selectedCategoryId === null
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-green-600 border-green-600 hover:bg-green-100'
            }`}
          >
            Semua Produk
          </button>
          {!categoriesLoading && !categoriesError && categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`px-3 py-1.5 rounded-full border transition-colors duration-300 ${
                selectedCategoryId === category.id
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-green-600 border-green-600 hover:bg-green-100'
              }`}
            >
              {category.nama}
            </button>
          ))}
        </div>
         
          {/* Loading State */}
          {(productsLoading || storesLoading) && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              <span className="ml-3 text-gray-600">Memuat menu...</span>
            </div>
          )}

          {/* Error State */}
          {(productsError || storesError) && (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">
                Gagal memuat data: {productsError || storesError}
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!productsLoading && !storesLoading && recommendedProducts.length > 0 && (
            <div className="flex justify-center w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl">
                {recommendedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="w-full max-w-[180px] bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative w-full h-24">
                      <Image
                        key={`${product.id}-${product.updatedAt || Date.now()}`} // Tambah key untuk force re-render
                        src={getImageUrl(product)} // Gunakan fungsi dengan cache busting
                        alt={product.nama}
                        layout="fill"
                        objectFit="cover"
                        unoptimized={true} // Disable Next.js optimization untuk menghindari caching
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'http://localhost:3001/assets/default-food.jpg'
                        }}
                      />
                    </div>

                    <div className="p-2 text-center">
                      <h3 className="font-bold text-sm mb-1 text-black">
                        {product.nama}
                      </h3>
                      <p className="text-black font-semibold text-[10px] mb-2">
                        {getStoreName(product.shop_id)}
                      </p>
                      <div className="flex flex-col items-center space-y-0.5">
                        <span className="font-bold text-green-600 text-xs">
                          {formatPrice(product.harga)}
                        </span>
                        <button 
                          onClick={() => handleViewDetail(product.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded-full text-[10px] hover:bg-green-600 transition"
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!productsLoading && !storesLoading && recommendedProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Belum ada menu yang tersedia</p>
              <Link href="/products" className="text-green-500 hover:underline">
                Lihat semua produk
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
