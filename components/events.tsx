'use client';

import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useActivities } from '../hooks/useActivities';

const EventsPage = () => {
  const {
    activities,
    loading,
    error,
  } = useActivities();

  // Helper function to format waktu_pelaksanaan into date and time strings
  const formatDateTime = (datetime: string) => {
    const dateObj = new Date(datetime);
    const optionsDate: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const date = dateObj.toLocaleDateString('id-ID', optionsDate);
    const time = dateObj.toLocaleTimeString('id-ID', optionsTime);
    return { date, time };
  };

  return (
    <>
      <Head>
        <title>Events - Kuliner Tamansari</title>
        <meta name="description" content="Jadwal Pengajian dan Kegiatan di Kuliner Tamansari" />
      </Head>

      <div className="min-h-screen bg-white flex flex-col">
        {/* Events Section */}
        <div className="flex flex-col items-center py-6">
          <h2 className="text-xl font-bold mb-6 text-center text-black">Jadwal Pengajian dan Kegiatan</h2>

          {loading && <p>Loading activities...</p>}
          {error && <p className="text-red-600">Error: {error}</p>}

          {!loading && !error && (
            <div className="max-w-4xl w-full px-4 space-y-6">
              {activities.length === 0 && <p>No activities found.</p>}
              {activities.map((activity) => {
                const { date, time } = formatDateTime(activity.waktu_pelaksanaan);
                return (
                  <Link key={activity.id} href={`/activities/${activity.id}`} className="block bg-white border rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row hover:shadow-lg transition-shadow">
                    <div className="relative w-full sm:w-1/3 h-40">
                      {activity.foto ? (
                        <Image
                          src={activity.foto.startsWith('https') || activity.foto.startsWith('/')
                            ? activity.foto
                            : 'https://sentratamansari.com/' + activity.foto}
                          alt={activity.nama}
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col justify-center w-full sm:w-2/3">
                      <h3 className="font-semibold text-black text-lg mb-2">{activity.nama}</h3>
                      <p className="text-sm text-gray-600">📅 <strong>Waktu Pelaksanaan:</strong> {activity.waktu_pelaksanaan}</p>
                      {/* <p className="text-sm text-gray-600">⏰ <strong>Waktu:</strong> {time}</p> */}
                      <p className="text-sm text-gray-600">📍 <strong>Lokasi:</strong> {activity.lokasi || 'N/A'}</p>
                      <p className="text-sm text-gray-600">👥 <strong>Peserta:</strong> {activity.peserta}</p>
                      <p className="text-sm text-gray-600">🎤 <strong>Penceramah:</strong> {activity.deskripsi || 'N/A'}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventsPage;
