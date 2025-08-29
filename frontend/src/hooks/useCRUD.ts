import { useState, useEffect, useCallback } from 'react';
import CRUDService from '../services/crudService';

interface UseCRUDOptions {
  endpoint: string;
  initialFetch?: boolean;
  initialFilters?: Record<string, any>;
}

interface CRUDState<T> {
  data: T[];
  currentItem: T | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

export function useCRUD<T = any>(options: UseCRUDOptions) {
  const { endpoint, initialFetch = true, initialFilters = {} } = options;
  const service = new CRUDService();

  const [state, setState] = useState<CRUDState<T>>({
    data: [],
    currentItem: null,
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
  });

  // CREATE operation
  const create = useCallback(async (itemData: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const newItem = await service.create<T>(endpoint, itemData);
      setState(prev => ({
        ...prev,
        data: [...prev.data, newItem],
        loading: false,
      }));
      return { success: true, data: newItem };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create item';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, [endpoint]);

  // READ operation (fetch all)
  const fetchAll = useCallback(async (filters: Record<string, any> = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await service.readAll<any>(endpoint, filters);
      setState(prev => ({
        ...prev,
        data: Array.isArray(response) ? response : (response.data || response.items || []),
        totalPages: response.totalPages || 1,
        currentPage: response.currentPage || 1,
        loading: false,
      }));
      return { success: true, data: response };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch items';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, [endpoint]);

  // READ operation (fetch by ID)
  const fetchById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const item = await service.readById<T>(endpoint, id);
      setState(prev => ({
        ...prev,
        currentItem: item,
        loading: false,
      }));
      return { success: true, data: item };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch item';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, [endpoint]);

  // UPDATE operation
  const update = useCallback(async (id: string, updateData: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const updatedItem = await service.update<T>(endpoint, id, updateData);
      setState(prev => ({
        ...prev,
        data: prev.data.map((item: any) => 
          item._id === id || item.id === id ? updatedItem : item
        ),
        currentItem: prev.currentItem && (prev.currentItem as any)._id === id ? updatedItem : prev.currentItem,
        loading: false,
      }));
      return { success: true, data: updatedItem };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update item';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, [endpoint]);

  // DELETE operation
  const remove = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await service.delete(endpoint, id);
      setState(prev => ({
        ...prev,
        data: prev.data.filter((item: any) => item._id !== id && item.id !== id),
        currentItem: prev.currentItem && (prev.currentItem as any)._id === id ? null : prev.currentItem,
        loading: false,
      }));
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to delete item';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, [endpoint]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Clear current item
  const clearCurrentItem = useCallback(() => {
    setState(prev => ({ ...prev, currentItem: null }));
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setState({
      data: [],
      currentItem: null,
      loading: false,
      error: null,
      totalPages: 1,
      currentPage: 1,
    });
  }, []);

  // Refresh data
  const refresh = useCallback(() => {
    fetchAll(initialFilters);
  }, [fetchAll, initialFilters]);

  // Initial fetch
  useEffect(() => {
    if (initialFetch) {
      fetchAll(initialFilters);
    }
  }, [fetchAll, initialFetch, initialFilters]);

  return {
    // State
    data: state.data,
    currentItem: state.currentItem,
    loading: state.loading,
    error: state.error,
    totalPages: state.totalPages,
    currentPage: state.currentPage,
    
    // Operations
    create,
    fetchAll,
    fetchById,
    update,
    remove,
    
    // Utilities
    clearError,
    clearCurrentItem,
    reset,
    refresh,
  };
}

// Specific hooks for different entities
export const useProducts = (filters?: Record<string, any>) => {
  return useCRUD({
    endpoint: '/products',
    initialFetch: true,
    initialFilters: filters,
  });
};

export const useBusinesses = (filters?: Record<string, any>) => {
  return useCRUD({
    endpoint: '/businesses',
    initialFetch: true,
    initialFilters: filters,
  });
};

export const useOrders = (filters?: Record<string, any>) => {
  return useCRUD({
    endpoint: '/orders/my-orders',
    initialFetch: true,
    initialFilters: filters,
  });
};

export const useCart = () => {
  return useCRUD({
    endpoint: '/cart',
    initialFetch: true,
  });
};

export const useReviews = (filters?: Record<string, any>) => {
  return useCRUD({
    endpoint: '/reviews',
    initialFetch: true,
    initialFilters: filters,
  });
};

export const useWishlist = () => {
  return useCRUD({
    endpoint: '/wishlist',
    initialFetch: true,
  });
};

export const useNotifications = (filters?: Record<string, any>) => {
  return useCRUD({
    endpoint: '/notifications',
    initialFetch: true,
    initialFilters: filters,
  });
};

export const useSubscriptions = (filters?: Record<string, any>) => {
  return useCRUD({
    endpoint: '/subscriptions',
    initialFetch: true,
    initialFilters: filters,
  });
};

export default useCRUD;
