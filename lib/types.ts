export interface Shop {
  id: string;
  nama: string;
  pemilik: string;
  alamat: string;
  block_id: number;
  foto?: string;
  deskripsi?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  nama: string;
  harga: number;
  description?: string;
  foto?: string;
  category_id: number;
  shop_id: string;
  stok?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  nama: string;
  deskripsi?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Block {
  id: number;
  nama: string;
  deskripsi?: string;
  createdAt?: string;
  updatedAt?: string;
  shops?: Shop[];
}

export interface HouseNumber {
  id: number;
  nomor: string;
  block_id: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Activity {
  id: number;
  nama: string;
  deskripsi?: string;
  waktu_pelaksanaan: string;
  peserta: string;
  lokasi?: string;
  foto?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
