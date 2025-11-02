// Configuración base de la API
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface ApiResponse<T> {
    mensaje: string;
    estado: string;
    datos: T;
}

export interface ApiError {
    message: string;
    status: number;
    details?: unknown;
}

// Mapa de mensajes de error por código de estado
const ERROR_MESSAGES: Record<number, string> = {
    400: 'Datos inválidos',
    401: 'Credenciales incorrectas',
    403: 'Acceso denegado',
    404: 'Recurso no encontrado',
    409: 'El email o DNI ya están registrados',
    500: 'Error en el servidor',
    503: 'Servicio no disponible',
} as const;

/**
 * Obtiene los headers base para las peticiones HTTP
 */
const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const token = Cookies.get('auth_token');
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};

/**
 * Maneja la respuesta HTTP y extrae los datos o lanza errores
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        let errorMessage = `Error ${response.status}`;
        let errorDetails: unknown;
        
        try {
            const errorData = await response.json();
            errorMessage = errorData.mensaje || errorData.message || errorData.error || errorMessage;
            errorDetails = errorData;
        } catch {
            errorMessage = ERROR_MESSAGES[response.status];
        }
        
        const apiError: ApiError = {
            message: errorMessage,
            status: response.status,
            details: errorDetails,
        };
        
        throw new Error(JSON.stringify(apiError));
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }

    return {} as T;
};

/**
 * Crea una petición HTTP configurada
 */
const createRequest = (method: string, data?: unknown): RequestInit => {
    const baseConfig: RequestInit = {
        method,
        headers: getHeaders(),
    };

    if (data) {
        return {
            ...baseConfig,
            body: JSON.stringify(data),
        };
    }

    return baseConfig;
};

/**
 * Realiza una petición GET
 */
export const get = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, createRequest('GET'));
    return handleResponse<T>(response);
};

/**
 * Realiza una petición POST
 */
export const post = async <T>(endpoint: string, data?: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, createRequest('POST', data));
    return handleResponse<T>(response);
};

/**
 * Realiza una petición PUT
 */
export const put = async <T>(endpoint: string, data?: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, createRequest('PUT', data));
    return handleResponse<T>(response);
};

/**
 * Realiza una petición DELETE
 */
export const del = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, createRequest('DELETE'));
    return handleResponse<T>(response);
};

/**
 * Utilidad para manejar errores de la API
 */
export const parseApiError = (error: Error): ApiError => {
    try {
        return JSON.parse(error.message) as ApiError;
    } catch {
        return {
            message: error.message,
            status: 0,
        };
    }
};

export const apiClient = {
    get,
    post,
    put,
    delete: del,
};

export default {
    get,
    post,
    put,
    delete: del,
    parseApiError,
};