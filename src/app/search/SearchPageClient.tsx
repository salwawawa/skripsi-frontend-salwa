'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { apiService } from '../../../lib/api-service';
import { Product, Shop, Activity } from '../../../lib/types';

const SearchPageClient: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setShops([]);
      setActivities([]);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use new public search methods
        const [productsData, shopsData, activitiesData] = await Promise.all([
          apiService.searchProducts(query),
          apiService.searchShops(query),
          apiService.searchActivities(query),
        ]);
        setProducts(productsData);
        setShops(shopsData);
        setActivities(activitiesData);
      } catch (err) {
        setError('Failed to fetch search results.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Products</h2>
            {products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: any) => (
                  <div key={product.id} className="border border-gray-300 rounded-lg shadow hover:shadow-lg overflow-hidden">
                    <div className="relative w-full h-40">
                      <Image
                        src={
                          product.foto
                            ? product.foto.startsWith('https')
                              ? product.foto
                              : `https://sentratamansari.com/${product.foto.startsWith('/') ? product.foto.slice(1) : product.foto}`
                            : 'http://localhost:3001/assets/default-food.jpg'
                        }
                        alt={product.nama}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-lg">{product.nama}</h3>
                      <p className="text-green-600 font-semibold">{formatPrice(product.harga)}</p>
                      <Link href={`/products/${product.id}`} className="text-green-500 hover:underline mt-2 block">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Shops</h2>
            {shops.length === 0 ? (
              <p>No shops found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {shops.map((shop: any) => (
                  <div key={shop.id} className="border border-gray-300 rounded-lg shadow hover:shadow-lg p-4">
                    <h3 className="font-bold text-lg">{shop.nama}</h3>
                    <p>{shop.alamat}</p>
                    <Link href={`/stores/${shop.id}`} className="text-green-500 hover:underline mt-2 block">
                      View Store
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Activities</h2>
            {activities.length === 0 ? (
              <p>No activities found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activities.map((activity: any) => (
                  <div key={activity.id} className="border border-gray-300 rounded-lg shadow hover:shadow-lg p-4">
                    <h3 className="font-bold text-lg">{activity.nama}</h3>
                    <p>{new Date(activity.waktu_pelaksanaan).toLocaleDateString('id-ID')}</p>
                    <Link href={`/activities/${activity.id}`} className="text-green-500 hover:underline mt-2 block">
                      View Activity
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default SearchPageClient;
