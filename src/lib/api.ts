import ky, {
    type AfterResponseHook,
    type BeforeRequestHook,
    type BeforeRetryHook
} from "ky";
import { useAuthStore } from "../store/useAuthStore";
import { type RefreshTokenBody } from "../types/api";

const API_URL = "http://localhost:8080/api";

let refreshPromise: Promise<RefreshTokenBody> | null = null;

// Hook para insertar el token en cada peticion
const setTokenHeader: BeforeRequestHook = (request) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
        request.headers.set("Authorization", `Bearer ${token}`);
    }
}

// Hook para refrescar el token
const refreshToken: BeforeRetryHook = async ({ request, options, error, retryCount }) => {
    const refreshToken = useAuthStore.getState().refreshToken;

    if (!refreshToken) return ky.stop;

    try {
        // Si ya hay un refresco en curso, esperamos a ese.
        // Si no, creamos uno nuevo.
        if (!refreshPromise) {
            refreshPromise = ky.post(`${API_URL}/auth/refresh`, {
                json: { refresh_token: refreshToken }
            }).json<RefreshTokenBody>();
        }

        const data = await refreshPromise;

        useAuthStore.setState({
            accessToken: data.access_token,
            refreshToken: data.refresh_token
        });

        // Limpiamos la promesa para futuros refrescos (cuando el nuevo expire)
        refreshPromise = null;

        // Seteamos el nuevo token en la petición que se va a reintentar
        request.headers.set("Authorization", `Bearer ${data.access_token}`);
    } catch (error) {
        refreshPromise = null; // Limpiar si falla
        useAuthStore.getState().logout?.();
        return ky.stop;
    }
}

// Hook para manejar errores en la respuesta
const handleResponseError: AfterResponseHook = async (request, options, response) => {
    if (!response.ok) {
        try {
            const data = await response.json() as { error?: string };
            if (data.error) {
                throw new Error(data.error);
            }
        } catch (e) {
            // If not JSON or no error field, let ky handle it
            if (e instanceof Error && e.message !== "Unexpected end of JSON input") {
                throw e;
            }
        }
    }
    return response;
}

export const api = ky.extend({
    prefixUrl: "http://localhost:8080/api",
    retry: {
        limit: 1,
        statusCodes: [401]
    },
    hooks: {
        beforeRequest: [setTokenHeader],
        beforeRetry: [refreshToken],
        afterResponse: [handleResponseError]
    }
})

export const fetcher = <T>(url: string) => api.get(url).json<T>();