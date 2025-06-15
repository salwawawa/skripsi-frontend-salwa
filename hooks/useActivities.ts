// hooks/useActivities.ts
import { useState, useEffect } from 'react';
import { apiService } from '../lib/api-service';
import { Activity } from '../lib/types';

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getActivities();
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const searchActivities = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.searchActivities(query);
      setActivities(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getActivity(id.toString());
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activityData: Partial<Activity>) => {
    try {
      setLoading(true);
      const newActivity = await apiService.createActivity(activityData);
      setActivities(prev => [...prev, newActivity]);
      return newActivity;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async (id: number, activityData: Partial<Activity>) => {
    try {
      setLoading(true);
      const updatedActivity = await apiService.updateActivity(id.toString(), activityData);
      setActivities(prev => prev.map(activity => 
        activity.id === id ? updatedActivity : activity
      ));
      return updatedActivity;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id: number) => {
    try {
      setLoading(true);
      await apiService.deleteActivity(id.toString());
      setActivities(prev => prev.filter(activity => activity.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Filter activities by date range
  const getActivitiesByDateRange = (startDate: string, endDate: string) => {
    return activities.filter(activity => {
      const activityDate = new Date(activity.waktu_pelaksanaan);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return activityDate >= start && activityDate <= end;
    });
  };

  // Get upcoming activities
  const getUpcomingActivities = () => {
    const now = new Date();
    return activities
      .filter(activity => new Date(activity.waktu_pelaksanaan) > now)
      .sort((a, b) => new Date(a.waktu_pelaksanaan).getTime() - new Date(b.waktu_pelaksanaan).getTime());
  };

  // Get past activities
  const getPastActivities = () => {
    const now = new Date();
    return activities
      .filter(activity => new Date(activity.waktu_pelaksanaan) < now)
      .sort((a, b) => new Date(b.waktu_pelaksanaan).getTime() - new Date(a.waktu_pelaksanaan).getTime());
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    loading,
    error,
    fetchActivities,
    fetchActivity,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivitiesByDateRange,
    getUpcomingActivities,
    getPastActivities,
    refetch: fetchActivities,
  };
};