import useSWR from 'swr';
import { fetcher } from '../lib/api';
import { type InventoryItem } from '../types/api';

export function useInventory() {
    const { data, error, isLoading, mutate } = useSWR<InventoryItem[]>(
        'inventarios/me',
        fetcher
    );

    return {
        inventory: data,
        isLoading,
        error,
        refresh: mutate
    };
}
