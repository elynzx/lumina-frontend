import { create } from 'zustand';

interface BudgetState {
  eventType: string;
  selectedDate: string;
  capacity: number;
  startTime: string;
  endTime: string;

  setEventType: (eventType: string) => void;
  setSelectedDate: (date: string) => void;
  setCapacity: (capacity: number) => void;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  eventType: '',
  selectedDate: '',
  capacity: 0,
  startTime: '',
  endTime: '',

  setEventType: (eventType) => set({ eventType }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setCapacity: (capacity) => set({ capacity }),
  setStartTime: (time) => set({ startTime: time }),
  setEndTime: (time) => set({ endTime: time }),
}));