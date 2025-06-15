// hooks/useHouseNumbers.ts
import { useState, useEffect } from 'react';
import { apiService } from '../lib/api-service';
import { HouseNumber } from '../lib/types';

export const useHouseNumbers = () => {
  const [houseNumbers, setHouseNumbers] = useState<HouseNumber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHouseNumbers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getHouseNumbers();
      setHouseNumbers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchHouseNumber = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getHouseNumber(id.toString());
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createHouseNumber = async (houseNumberData: Partial<HouseNumber>) => {
    try {
      setLoading(true);
      const newHouseNumber = await apiService.createHouseNumber(houseNumberData);
      setHouseNumbers(prev => [...prev, newHouseNumber]);
      return newHouseNumber;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateHouseNumber = async (id: number, houseNumberData: Partial<HouseNumber>) => {
    try {
      setLoading(true);
      const updatedHouseNumber = await apiService.updateHouseNumber(id.toString(), houseNumberData);
      setHouseNumbers(prev => prev.map(houseNumber => 
        houseNumber.id === id ? updatedHouseNumber : houseNumber
      ));
      return updatedHouseNumber;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteHouseNumber = async (id: number) => {
    try {
      setLoading(true);
      await apiService.deleteHouseNumber(id.toString());
      setHouseNumbers(prev => prev.filter(houseNumber => houseNumber.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Filter house numbers by block
  const getHouseNumbersByBlock = (blockId: number) => {
    return houseNumbers.filter(house => house.block_id === blockId);
  };

  // Filter by status
//   const getHouseNumbersByStatus = (status: 'occupied' | 'vacant') => {
//     return houseNumbers.filter(house => house.status === status);
//   };

  useEffect(() => {
    fetchHouseNumbers();
  }, []);

  return {
    houseNumbers,
    loading,
    error,
    fetchHouseNumbers,
    fetchHouseNumber,
    createHouseNumber,
    updateHouseNumber,
    deleteHouseNumber,
    getHouseNumbersByBlock,
    // getHouseNumbersByStatus,
    refetch: fetchHouseNumbers,
  };
};