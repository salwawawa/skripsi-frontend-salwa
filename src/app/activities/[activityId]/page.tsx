'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiService } from '../../../../lib/api-service';
import { Activity } from '../../../../lib/types';

export default function ActivityDetailPage() {
  const params = useParams();
  const activityId = params.activityId as string;

  const [activity, setActivity] = useState<Activity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activityId) return;

    let isMounted = true;

    const loadActivity = async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await apiService.getActivity(activityId);
        if (isMounted) {
          setActivity(data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Kegiatan tidak ditemukan');
        }
      } finally {
        setLoading(false);
      }
    };

    loadActivity();

    return () => {
      isMounted = false;
    };
  }, [activityId]);

  const handleGoBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600 mt-4">Memuat kegiatan...</span>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-white container mx-auto py-8 px-4 text-center">
        <p>{error || 'Kegiatan tidak ditemukan.'}</p>
        <button
          onClick={handleGoBack}
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition mt-4"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:flex gap-8">
        {/* Activity Image */}
        <div className="md:w-1/2 mb-6 md:mb-0 rounded-lg overflow-hidden">
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
            <Image 
              src={
                activity.foto
                  ? activity.foto.startsWith('https')
                    ? activity.foto
                    : `https://sentratamansari.com/photos/activities/${activity.foto.startsWith('/') ? activity.foto.slice(1) : activity.foto}`
                  : 'http://localhost:3001/assets/default-food.jpg'
              }
              alt={activity.nama}
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

        {/* Activity Details */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold mb-4 text-gray-900">{activity.nama}</h1>
          <p className="text-gray-700 mb-6">{activity.deskripsi || 'Deskripsi kegiatan tidak tersedia.'}</p>
          <p className="text-gray-700 mb-2"><strong>Waktu Pelaksanaan:</strong> {activity.waktu_pelaksanaan}</p>
          <p className="text-gray-700 mb-6"><strong>Lokasi:</strong> {activity.lokasi}</p>
          <div className="flex gap-3">
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
