export interface LoginResponse {
    refresh_token: string;
    access_token: string;
    token_type: string;
}

export interface RefreshResponse {
    refresh_token: string;
    access_token: string;
}

export const AUTH_API = {
    login: async (username: string, password: string): Promise<LoginResponse> => {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return response.json();
    },

    refresh: async (refreshToken: string): Promise<RefreshResponse> => {
        const response = await fetch('http://localhost:8080/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Refresh failed');
        }

        return response.json();
    },
};
