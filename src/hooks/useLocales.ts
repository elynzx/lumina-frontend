import { useMemo } from 'react';
import { data } from '@/constants/data';
import type { Distrito, TipoEvento } from '@/constants/data';

/**
 * Hook para obtener distritos
 */
export const useDistritos = () => {
  return useMemo(() => {
    return data.distritos.map(distrito => ({
      value: distrito.idDistrito,
      label: distrito.nombreDistrito
    }));
  }, []);
};

/**
 * Hook para obtener tipos de evento
 */
export const useTiposEvento = () => {
  return useMemo(() => {
    return data.tiposEvento.map(tipo => ({
      value: tipo.idTipoEvento,
      label: tipo.nombreTipo
    }));
  }, []);
};

/**
 * Hook para obtener locales disponibles
 */
export const useLocales = () => {
  return useMemo(() => {
    return data.locales.filter(local => local.estado === 'DISPONIBLE');
  }, []);
};

/**
 * Hook para obtener nombre de distrito por ID
 */
export const useDistritoName = (id: number) => {
  return useMemo(() => {
    const distrito = data.distritos.find(d => d.idDistrito === id);
    return distrito?.nombreDistrito || 'Desconocido';
  }, [id]);
};

/**
 * Hook para obtener tipos de evento por local
 */
export const useTiposEventoPorLocal = (localId: number) => {
  return useMemo(() => {
    const tiposPermitidos = data.localTipoEvento
      .filter(lte => lte.idLocal === localId)
      .map(lte => lte.idTipoEvento);

    return data.tiposEvento.filter(tipo => tiposPermitidos.includes(tipo.idTipoEvento));
  }, [localId]);
};

/**
 * Hook para filtrar locales con múltiples criterios
 */
export const useFiltrarLocales = (filtros: {
  tipoEvento?: number;
  distrito?: number;
  capacidadMinima?: number;
  precioMin?: number;
  precioMax?: number;
  busqueda?: string;
}) => {
  return useMemo(() => {
    let localesFiltrados = data.locales.filter(local => local.estado === 'DISPONIBLE');

    // Filtrar por tipo de evento
    if (filtros.tipoEvento) {
      const localesPermitidos = data.localTipoEvento
        .filter(lte => lte.idTipoEvento === filtros.tipoEvento)
        .map(lte => lte.idLocal);
      localesFiltrados = localesFiltrados.filter(local => localesPermitidos.includes(local.idLocal));
    }

    // Filtrar por distrito
    if (filtros.distrito) {
      localesFiltrados = localesFiltrados.filter(local => local.idDistrito === filtros.distrito);
    }

    // Filtrar por capacidad
    if (filtros.capacidadMinima) {
      localesFiltrados = localesFiltrados.filter(local => local.aforoMaximo >= filtros.capacidadMinima!);
    }

    // Filtrar por precio
    if (filtros.precioMin !== undefined) {
      localesFiltrados = localesFiltrados.filter(local => local.precioHora >= filtros.precioMin!);
    }
    if (filtros.precioMax !== undefined) {
      localesFiltrados = localesFiltrados.filter(local => local.precioHora <= filtros.precioMax!);
    }

    // Filtrar por búsqueda
    if (filtros.busqueda?.trim()) {
      const busquedaLower = filtros.busqueda.toLowerCase();
      localesFiltrados = localesFiltrados.filter(local =>
        local.nombreLocal.toLowerCase().includes(busquedaLower) ||
        local.descripcion.toLowerCase().includes(busquedaLower)
      );
    }

    return localesFiltrados;
  }, [filtros.tipoEvento, filtros.distrito, filtros.capacidadMinima, filtros.precioMin, filtros.precioMax, filtros.busqueda]);
};

/**
 * Hook para obtener rango de precios
 */
export const usePriceRange = () => {
  return useMemo(() => {
    const precios = data.locales.map(local => local.precioHora);
    return {
      min: Math.min(...precios),
      max: Math.max(...precios)
    };
  }, []);
};
