
// 'use client';

// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useParams } from 'next/navigation';
// import HomePage from '../../homepage';

// // Define product type
// interface Product {
//   id: string;
//   name: string;
//   price: string;
//   image: string;
//   category: string;
//   description: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   price: string;
//   image: string;
//   category: string;
//   description: string;
//   storeId: string;
// }

// // Sample product database
// const productDatabase: Record<string, Product> = {
//   'ayam-bekakak-bakar': {
//     id: 'ayam-bekakak-bakar',
//     name: 'Ayam Bekakak Bakar',
//     price: 'Rp 40.000',
//     image: '/assets/bekakakbakar-depawon.jpg',
//     category: 'DE PAWON OMAH',
//     description: 'Ayam bekakak bakar adalah hidangan khas dengan cita rasa rempah yang kaya. Dimasak dengan bumbu tradisional dan dipanggang hingga sempurna, menciptakan aroma dan rasa yang menggugah selera.',
//     storeId: 'de-pawon-omah'
//   },
//   'nasi-tumpeng': {
//     id: 'nasi-tumpeng',
//     name: 'Nasi Tumpeng',
//     price: 'Rp 80.000',
//     image: '/assets/tumpeng-depawon.jpg',
//     category: 'DE PAWON OMAH',
//     description: 'Nasi tumpeng adalah hidangan nasi kuning berbentuk kerucut yang disajikan dengan berbagai lauk pauk tradisional. Merupakan makanan yang biasa disajikan pada acara perayaan dan selamatan.',
//     storeId: 'de-pawon-omah'
//   }
// };

// declare global {
//   interface Window {
//     botpressWebChat?: {
//       open?: () => void;
//       sendEvent?: (event: { type: string }) => void;
//     };
//   }
// }

// export default function ProductDetails() {
//   const params = useParams();
//   const router = useRouter();
//   let productId = params.id;
//   if (Array.isArray(productId)) {
//     productId = productId[0];
//   }

//   const product = productId ? productDatabase[productId] : null;

//   if (!product) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center">
//         <h1 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h1>
//         <Link href="/menu" className="text-green-600 hover:underline">
//           Kembali ke Menu
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white py-12 px-4">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="md:flex">
//           <div className="md:w-1/2">
//             <div className="relative h-72 md:h-full">
//               <Image
//                 src={product.image}
//                 alt={product.name}
//                 layout="fill"
//                 objectFit="cover"
//               />
//             </div>
//           </div>
//           <div className="p-8 md:w-1/2">
//             <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">
//               {product.category}
//             </div>
//             <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>
//             <p className="mt-4 text-lg text-gray-700">{product.description}</p>
//             <div className="mt-6">
//               <span className="text-2xl font-bold text-green-600">{product.price}</span>
//             </div>
//             <div className="mt-8 flex space-x-4">
//             <button
//               onClick={() => {
//                 const storeUrl = `/stores/${product?.storeId}`;
//                 if (storeUrl) {
//                   window.location.href = storeUrl;
//                 }
//               }}
//               className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
//             >
//               Lihat Toko
//             </button>
//             <button
//               onClick={() => router.back()}
//               className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition"
//             >
//               Kembali
//             </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// app/menu/product-details/[id]/page.tsx

// ----------------INTEGRASI BACKEND 1-----------------------

// 'use client';

// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useParams } from 'next/navigation';
// import { useProducts } from '../../../../../hooks/useProducts'; // Sesuaikan path
// import { useStores } from '../../../../../hooks/useStores'; // Sesuaikan path
// import { Product } from '../../../../../lib/types'; // Sesuaikan path

// export default function ProductDetails() {
//   const params = useParams();
//   const router = useRouter();
//   const { products, loading: productsLoading, error: productsError } = useProducts();
//   const { stores, loading: storesLoading, error: storesError } = useStores();
  
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   let productId = params.id;
//   if (Array.isArray(productId)) {
//     productId = productId[0];
//   }

//   // Format price helper
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('id-ID', {
//       style: 'currency',
//       currency: 'IDR',
//       minimumFractionDigits: 0
//     }).format(price);
//   };

//   // Function to get store name by ID
//   const getStoreName = (storeId: string) => {
//     const store = stores?.find(s => s.id === storeId);
//     return store ? store.nama : 'Unknown Store';
//   };

//   // Function to get store by ID
//   const getStore = (storeId: string) => {
//     return stores?.find(s => s.id === storeId);
//   };

//   useEffect(() => {
//     if (!productId || productsLoading || storesLoading) {
//       return;
//     }

//     if (productsError || storesError) {
//       setError(productsError || storesError);
//       setLoading(false);
//       return;
//     }

//     if (products && Array.isArray(products)) {
//       const foundProduct = products.find(p => p.id === productId);
//       if (foundProduct) {
//         setProduct(foundProduct);
//       } else {
//         setError('Produk tidak ditemukan');
//       }
//     }
    
//     setLoading(false);
//   }, [productId, products, stores, productsLoading, storesLoading, productsError, storesError]);

//   // Loading state
//   if (loading || productsLoading || storesLoading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
//         <span className="ml-3 text-gray-600 mt-4">Memuat detail produk...</span>
//       </div>
//     );
//   }

//   // Error state
//   if (error || !product) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white">
//         <h1 className="text-2xl font-bold mb-4 text-gray-900">
//           {error || 'Produk tidak ditemukan'}
//         </h1>
//         <div className="flex space-x-4">
//           <button
//             onClick={() => router.back()}
//             className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition"
//           >
//             Kembali
//           </button>
//           <Link href="/" className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition">
//             Ke Beranda
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const store = getStore(product.shop_id);

//   return (
//     <div className="min-h-screen bg-white py-12 px-4">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="md:flex">
//           {/* Product Image */}
//           <div className="md:w-1/2">
//             <div className="relative h-72 md:h-full">
//               <Image
//                 src={
//                   product.foto
//                     ? product.foto.startsWith('http') // Sudah full URL
//                       ? product.foto
//                       : `http://localhost:3001/${product.foto.startsWith('/') ? product.foto.slice(1) : product.foto}`
//                     : 'http://localhost:3001/assets/default-food.jpg'
//                 }
//                 alt={product.nama}
//                 layout="fill"
//                 objectFit="cover"
//                 onError={(e) => {
//                   const target = e.target as HTMLImageElement;
//                   target.src = 'http://localhost:3001/assets/default-food.jpg';
//                 }}
//               />
//             </div>
//           </div>

//           {/* Product Details */}
//           <div className="p-8 md:w-1/2">
//             <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">
//               {getStoreName(product.shop_id)}
//             </div>
//             <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.nama}</h1>
            
//             {/* Description */}
//             <p className="mt-4 text-lg text-gray-700">
//               {product.description || product.description || 'Deskripsi produk tidak tersedia.'}
//             </p>

//             {/* Price */}
//             <div className="mt-6">
//               <span className="text-2xl font-bold text-green-600">
//                 {formatPrice(product.harga)}
//               </span>
//             </div>

//             {/* Additional Info */}
//             {product.category_id && (
//               <div className="mt-4">
//                 <span className="text-sm text-gray-600">Kategori: </span>
//                 <span className="text-sm font-medium text-gray-800">{product.category_id}</span>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="mt-8 flex space-x-4">
//               {store && (
//                 <button
//                   onClick={() => {
//                     router.push(`/stores/${product.shop_id}`);
//                   }}
//                   className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
//                 >
//                   Lihat Toko
//                 </button>
//               )}
              
//               <button
//                 onClick={() => router.back()}
//                 className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition"
//               >
//                 Kembali
//               </button>
//             </div>

//             {/* Store Info */}
//             {store && (
//               <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//                 <h3 className="font-semibold text-gray-800 mb-2">Informasi Toko</h3>
//                 <p className="text-sm text-gray-600">
//                   <strong>Nama:</strong> {store.nama}
//                 </p>
//                 {store.alamat && (
//                   <p className="text-sm text-gray-600">
//                     <strong>Alamat:</strong> {store.alamat}
//                   </p>
//                 )}
//                 {/* {store.kontak && (
//                   <p className="text-sm text-gray-600">
//                     <strong>Kontak:</strong> {store.kontak}
//                   </p>
//                 )} */}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useParams } from 'next/navigation';
import { useProducts } from '../../../../../hooks/useProducts';
import React, { useState, useEffect } from 'react';
import { Product } from '../../../../../lib/types';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const { fetchProduct } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  
  useEffect(() => {
    // DI SINI FETCH DATA DARI BACKEND
    const loadProduct = async () => {
      try {
        const data = await fetchProduct(productId);
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
      }
    };
    
    loadProduct();
  }, [productId]);

  return (
    <div>
      {product ? (
        <div>
          <h1>{product.nama}</h1>
          <p>{product.description}</p>
          <p>{product.harga}</p>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
