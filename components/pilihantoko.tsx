'use client';

import Image from 'next/image';

export interface Store {
  id: string;
  name: string;
  address: string;
  description: string;
  imageUrl: string;
}

interface StoreCardProps {
  store: Store;
}

const StoreCard = ({ store }: StoreCardProps) => {
  return (
    <div className="border rounded-md overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="md:flex">
        <div className="md:w-1/3 relative h-48 md:h-auto">
          <Image 
            src={store.imageUrl} 
            alt={store.name} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-4 md:w-2/3">
          <h3 className="text-lg font-semibold text-green-600">{store.name}</h3>
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
            <span>{store.address}</span>
          </div>
          <p className="text-gray-700 text-sm">{store.description}</p>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;