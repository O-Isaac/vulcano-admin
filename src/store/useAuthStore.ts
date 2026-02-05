import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { login, getMe } from '../services/vulcano.service';

interface User {
    // JWT Standard Claims
    iss?: string;
    sub?: string;
    exp?: number;
    iat?: number;
    
    // App Specific (JWT or API)
    roles?: string;
    role?: string; // API
    nivel?: number;
    creditos?: number;
    correo?: string;
    id?: number;
}

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    setTokens: (access: string, refresh: string) => void;
    refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            user: null,

            refreshUser: async () => {
                try {
                    const profile = await getMe();
                    set((state) => ({
                        // Merge existing user state (JWT claims) with new profile data
                        user: state.user ? { ...state.user, ...profile } : profile
                    }));
                } catch (error) {
                   console.error("Failed to refresh user profile", error);
                }
            },

            login: async (username, password) => {
                const response = await login(username, password);

                try {
                    const decoded = jwtDecode<User>(response.access_token);

                    set({
                        accessToken: response.access_token,
                        refreshToken: response.refresh_token,
                        isAuthenticated: true,
                        user: decoded,
                    });
                    
                    // Fetch full details
                    await get().refreshUser();

                } catch (error) {
                    console.error("Failed to decode token or fetch profile", error);
                    throw new Error('Login failed');
                }
            },

            logout: () => {
                sessionStorage.removeItem('vulcano_intro_shown');
                set({
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    user: null,
                });
            },

            setTokens: (access, refresh) => {
                try {
                    const decoded = jwtDecode<User>(access);
                    set((state) => ({
                        accessToken: access,
                        refreshToken: refresh,
                        isAuthenticated: true,
                        // Preserve existing detailed user info if available, just update claims
                        user: state.user ? { ...state.user, ...decoded } : decoded,
                    }));
                    
                    // Try to refresh profile in background if we have tokens
                    get().refreshUser().catch(console.error);

                } catch {
                    set({
                        accessToken: access,
                        refreshToken: refresh,
                        isAuthenticated: true,
                        user: null
                    });
                }
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
