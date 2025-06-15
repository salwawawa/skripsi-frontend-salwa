// pages/about.tsx
'use client';

import { JSX, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

// FAQ Item Component
interface FAQItemProps {
  question: string;
  answer: string;
  isNumbered?: boolean;
}

const FAQItem: FC<FAQItemProps> = ({ question, answer, isNumbered = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Function untuk memformat jawaban dengan nomor urut
  const formatAnswer = (answer: string, isNumbered: boolean = false) => {
    if (!isNumbered) {
      return <div>{answer}</div>;
    }

    // Split jawaban berdasarkan delimiter "|" atau "\n" yang diikuti dengan nomor
    const steps = answer.includes('|') 
      ? answer.split('|').filter(step => step.trim() !== '')
      : answer.split('\n').filter(step => step.trim() !== '');
    
    return (
      <ol className="space-y-3">
        {steps.map((step, index) => {
          // Remove existing numbering if any (like "1. ", "2. ", etc.)
          const cleanStep = step.replace(/^\s*\d+\.\s*/, '').trim();
          
          return (
            <li key={index} className="flex items-start">
              <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                {index + 1}
              </span>
              <span>{cleanStep}</span>
            </li>
          );
        })}
      </ol>
    );
  };

  return (
    <div className="text-black mb-3">
      <div 
        className="flex justify-between font-bold items-center p-3 bg-green-600 rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span className="text-xl font-bold">{isOpen ? '-' : '+'}</span>
      </div>
        {isOpen && (
        <div className="p-3 bg-white text-black rounded-lg shadow-md mt-1 border border-green-600">
            {formatAnswer(answer, isNumbered)}
          </div>
        )}
    </div>
  );
};

interface FAQItem {
  question: string;
  answer: string;
  isNumbered?: boolean;
}

export default function About(): JSX.Element {
  // FAQ data
  const faqItems: FAQItem[] = [
    {
      question: "Kenapa website Sentra Tamansari dibuat?",
      answer: "Website ini dibuat dengan tujuan bisa memudahkan promosi dengan menampilkan produk yang dijual oleh penduduk Tamansari Bukit Damai Blok C, produk yang ditampilkan diantaranya adalah makanan seperti hidangan utama, snack, lauk pauk dan sebagainya. Banyak juga produk dengan jenis lainnya contohnya seperti produk kecantikan dan variasi lainnya. Dengan adanya website ini, Anda bisa mengeksplor produk yang dijual di Tamansari Blok C kapanpun dan dimanapun! ❤️"
    },
    {
      question: "Apa kegunaan dari chatbot TAMI?",
      answer: "Chatbot TAMI berfungsi sebagai bot aktif yang bisa diakses kapan saja dan akan membantu pengguna website Sentra Tamansari untuk menjawab perihal produk-produk yang dijual oleh Ibu - Ibu penduduk Tamansari Bukit Damai Blok C, selain menjawab tentang produk, TAMI juga bisa digunakan untuk memesan produk secara langsung, Lho! TAMI juga akan menjawab perihal kegiatan yang akan datang dari MT Ar - Rayyan, maka gunakan TAMI sebaik mungkin ya 😊"
    },
    {
      question: "Bagaimana cara menggunakan bot TAMI dan dimana saja bisa mengaksesnya?",
      answer: "Klik tombol chatbot yang terletak di kanan bawah layar|Tunggu hingga jendela chat terbuka|Katakan Hai kepada TAMI|TAMI akan merespons secara otomatis dalam beberapa detik|Anda bisa langsung bertanya produk, kegiatan atau pesan produk dengan tombol pesan otomatis yang tersedia|Untuk memesan produk, ikuti instruksi yang diberikan TAMI|Bot TAMI dapat diakses 24/7 di website Sentra Tamansari",
      isNumbered: true
    },
    {
      question: "Bagaimana jika saya mengalami kendala saat memesan produk atau saat menggunakan bot TAMI?",
      answer: "Hubungi admin melalui fitur 'Kritik & Saran' di bot TAMI atau melalui kontak yang tersedia di website|Screenshot error atau masalah yang terjadi untuk memudahkan troubleshooting|Jelaskan kendala yang dialami dengan sejelas mungkin|Tunggu respon dari tim support",
      isNumbered: true
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <Head>
        <title>About - Majelis Taklim Ar-Rayyan</title>
        <meta name="description" content="About Majelis Taklim Ar-Rayyan" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-black text-center mb-8">Tentang Majelis Taklim Ar-Rayyan</h1>
        
        <div className="flex flex-col md:flex-row items-center justify-center mb-8">
          <div className="mb-4 md:mb-0 md:mr-8">
            <div className="relative w-40 h-40">
              <Image 
                src="/assets/logo-dkm.jpg" 
                alt="Logo Majelis Taklim Ar-Rayyan" 
                layout="fill"
                objectFit="contain"
                className="rounded-full"
              />
            </div>
          </div>
          
          <div className="flex items-center text-black">
            <div className="mr-3">
              <Image 
                src="/assets/logo-instagram.png" 
                alt="Instagram" 
                width={40} 
                height={40}
              />
            </div>
            <div>
              <p className="font-bold text-black">Instagram</p>
              <p>@dkm_arrayyan</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-300 pt-6 max-w-3xl mx-auto p-6">
          <h2 className="text-xl font-bold text-black text-center mb-6">Frequently Asked Question</h2>
          
          <div className="max-w-2xl mx-auto">
            {faqItems.map((item, index) => (
              <FAQItem 
                key={index} 
                question={item.question} 
                answer={item.answer}
                isNumbered={item.isNumbered}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}