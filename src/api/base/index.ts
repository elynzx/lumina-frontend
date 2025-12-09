/**
 * Configuración base de la API
 * Cliente HTTP centralizado con autenticación JWT y manejo de errores
 */
import Cookies from 'js-cookie';
import type { ApiError, BackendResponse, } from '@/api/interfaces/common';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Re-exporta tipos comunes en base a la API
 */
export type { ApiResponse, BackendResponse, ApiError } from '@/api/interfaces/common';

/**
 * Mapa de mensajes de error por código de estado HTTP
 */
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
 * Incluye Content-Type y Authorization (JWT) si existe token
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
 * Parsea errores del backend y los transforma en ApiError
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
 * Crea una petición HTTP configurada con headers y body
 */
const createRequest = (method: string, data?: unknown): RequestInit => {
    const baseConfig: RequestInit = {
        method,
        headers: getHeaders(),
        credentials: 'include',
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
 * Métodos HTTP principales.
 */
const get = async <T>(url: string): Promise<BackendResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${url}`, createRequest('GET'));
    return handleResponse<BackendResponse<T>>(response);
};

const post = async <T>(url: string, data: unknown): Promise<BackendResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${url}`, createRequest('POST', data));
    return handleResponse<BackendResponse<T>>(response);
};

const put = async <T>(url: string, data?: unknown): Promise<BackendResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${url}`, createRequest('PUT', data));
    return handleResponse<BackendResponse<T>>(response);
};

const del = async <T>(url: string): Promise<BackendResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${url}`, createRequest('DELETE'));
    return handleResponse<BackendResponse<T>>(response);
};

/**
 * Parsea error de respuesta HTTP a formato ApiError
 * @param error - Error capturado
 * @returns Objeto ApiError con mensaje y código
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

/**
 * Cliente principal para consumir la API.
 */
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