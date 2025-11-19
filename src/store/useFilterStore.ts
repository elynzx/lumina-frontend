// store/filterStore.ts
import { create } from "zustand";

export interface FilterState {

  eventTypeId: number | null;
  priceRange: { min: number; max: number } | null;
  minCapacity: number | null;
  maxCapacity: number | null;

  districtId: number | null;
  searchCapacity: number | null;

  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  eventTypeId: null,

  // Catálogo
  priceRange: null,
  minCapacity: null,
  maxCapacity: null,

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
      minCapacity: null,
      maxCapacity: null,
      districtId: null,
      searchCapacity: null,
    });
  },
}));
