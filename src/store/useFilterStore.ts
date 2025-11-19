// store/filterStore.ts
import { create } from "zustand";

export interface FilterState {

  eventTypeId: number | null;
  priceRange: { min: number; max: number } | null;
  minCapacity: number | null; // Agregado para manejar capacidad mínima
  maxCapacity: number | null; // Agregado para manejar capacidad máxima

  districtId: number | null;
  searchCapacity: number | null;

  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  eventTypeId: null,

  // Catálogo
  priceRange: null,
  minCapacity: null, // Inicializado
  maxCapacity: null, // Inicializado

  // Home
  districtId: null,
  searchCapacity: null,

  setFilters: (filters) => {
    set((state) => ({ ...state, ...filters }));
  },

  clearFilters: () => {
    set({
      eventTypeId: null,
      priceRange: null,
      minCapacity: null, // Limpiado
      maxCapacity: null, // Limpiado
      districtId: null,
      searchCapacity: null,
    });
  },
}));
