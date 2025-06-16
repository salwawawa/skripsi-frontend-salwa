'use client';

import { useState, useEffect } from 'react';

export interface Block {
  id: string;
  nama: string;
  deskripsi?: string;
}

export function useBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlocks() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://sentratamansari.com/api/v1/blocks');
        if (!response.ok) {
          throw new Error('Failed to fetch blocks');
        }
        const json = await response.json();
        setBlocks(json.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchBlocks();
  }, []);

  return { blocks, loading, error };
}
