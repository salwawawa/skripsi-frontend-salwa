import { useState, useEffect } from 'react';
import { apiService } from '../lib/api-service';
import { Shop } from '../lib/types';

export const useStores = () => {
  const [stores, setStores] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getShops();
      setStores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchStore = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getShop(id);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createStore = async (storeData: Partial<Shop>) => {
    try {
      setLoading(true);
      const newStore = await apiService.createShop(storeData);
      setStores(prev => [...prev, newStore]);
      return newStore;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStore = async (id: string, storeData: Partial<Shop>) => {
    try {
      setLoading(true);
      const updatedStore = await apiService.updateShop(id, storeData);
      setStores(prev => prev.map(store => 
        store.id === id ? updatedStore : store
      ));
      return updatedStore;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteStore = async (id: string) => {
    try {
      setLoading(true);
      await apiService.deleteShop(id);
      setStores(prev => prev.filter(store => store.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return {
    stores,
    loading,
    error,
    fetchStores,
    fetchStore,
    createStore,
    updateStore,
    deleteStore,
    refetch: fetchStores,
  };
};