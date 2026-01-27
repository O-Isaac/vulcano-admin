import { AUTH_API } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';

// Helper to create authenticated fetch wrapper
export const apiFetch = async (url: string, options: RequestInit = {}) => {
    let accessToken = useAuthStore.getState().accessToken;

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
