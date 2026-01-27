import { AUTH_API } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';
import type { Recurso } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Helper to create authenticated fetch wrapper
export const apiFetch = async (url: string, options: RequestInit = {}) => {
    let accessToken = useAuthStore.getState().accessToken;

    // Prepend base URL if not absolute
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = API_BASE_URL + url;
    }

    // Attach token if needed
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    } as Record<string, string>;

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    let response = await fetch(url, { ...options, headers });

    // Handle 401 - Try to refresh
    if (response.status === 401) {
        try {
            const refreshToken = useAuthStore.getState().refreshToken;
            if (!refreshToken) throw new Error('No refresh token');

            const newTokens = await AUTH_API.refresh(refreshToken);

            // Update store
            useAuthStore.getState().setTokens(newTokens.access_token, newTokens.refresh_token);

            // Retry original request with new token
            headers['Authorization'] = `Bearer ${newTokens.access_token}`;
            response = await fetch(url, { ...options, headers });
        } catch (error) {
            // Logout if refresh fails
            useAuthStore.getState().logout();
            throw error;
        }
    }

    return response;
};

/**
 * Fetcher para usar con SWR u otras librerías de data fetching
 * @param args Argumentos para el fetch
 * @returns Respuesta parseada como JSON
 * @see SWR documentation: https://swr.vercel.app/docs/getting-started
 */
export const apiFetcher = (...args: unknown[]) => apiFetch(...(args as [string, RequestInit]))
    .then(res => res.json());


export const updateRecurso = async (recurso: Recurso): Promise<Boolean> => {
    const response = await apiFetch(`/api/recursos/${recurso.id}`, {
        method: 'PUT',
        body: JSON.stringify(recurso),
    });

    return response.ok;
}

export const deleteRecurso = async (id: number): Promise<Boolean> => {
    const response = await apiFetch(`/api/recursos/${id}`, {
        method: 'DELETE',
    });
    
    return response.ok;
}

export const createRecurso = async (recurso: Partial<Recurso>): Promise<Boolean> => {
    const response = await apiFetch(`/api/recursos`, {
        method: 'POST',
        body: JSON.stringify(recurso),
    });
    
    return response.ok;
}