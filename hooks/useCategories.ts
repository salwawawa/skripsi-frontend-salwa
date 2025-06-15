import { useState, useEffect } from 'react';
import { apiService } from '../lib/api-service';
import { Category } from '../lib/types';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCategory(id.toString());
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: Partial<Category>) => {
    try {
      setLoading(true);
      const newCategory = await apiService.createCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: number, categoryData: Partial<Category>) => {
    try {
      setLoading(true);
      const updatedCategory = await apiService.updateCategory(id.toString(), categoryData);
      setCategories(prev => prev.map(category => 
        category.id === id ? updatedCategory : category
      ));
      return updatedCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      setLoading(true);
      await apiService.deleteCategory(id.toString());
      setCategories(prev => prev.filter(category => category.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
};