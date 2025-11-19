import { create } from 'zustand';
import type { VenueDetail } from '@/api/interfaces/venue';

interface VenueState {
  venueId: number | null;
  venueData: VenueDetail | null;
  unavailableDates: string[];
  setVenueId: (id: number) => void;
  setVenueData: (data: VenueDetail) => void;
  setUnavailableDates: (dates: string[]) => void;
}

export const useVenueStore = create<VenueState>((set) => ({
  venueId: null,
  venueData: null,
  unavailableDates: [],
  setVenueId: (id) => set({ venueId: id }),
  setVenueData: (data) => set({ venueData: data }),
  setUnavailableDates: (dates) => set({ unavailableDates: dates }),
}));