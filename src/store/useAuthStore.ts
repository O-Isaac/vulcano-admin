import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { login } from '../services/vulcano.service';

interface User {
    iss: string;
    sub: string;
    exp: number;
    iat: number;
    roles: string;
    nivel: number;
}

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    setTokens: (access: string, refresh: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            user: null,

            login: async (username, password) => {
                const response = await login(username, password);

                try {
                    const user = jwtDecode<User>(response.access_token);

                    set({
                        accessToken: response.access_token,
                        refreshToken: response.refresh_token,
                        isAuthenticated: true,
                        user,
                    });
                } catch (error) {
                    console.error("Failed to decode token", error);
                    throw new Error('Invalid token received');
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
                    const user = jwtDecode<User>(access);
                    set({
                        accessToken: access,
                        refreshToken: refresh,
                        isAuthenticated: true,
                        user,
                    });
                } catch {
                    set({
                        accessToken: access,
                        refreshToken: refresh,
                        isAuthenticated: true,
                        // user? keep old or null? null is safer
                        user: null
                    });
                }
            },
        }),
        {
            name: 'auth-storage', // unique name
        }
    )
);
