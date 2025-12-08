import { create } from "zustand";

export interface SelectedFurniture {
  [key: number]: number;
}

export interface UserData {
  email: string;
  nombres: string;
  apellidos: string;
  dni: string;
  celular: string;
}

export interface SelectedModels {
  selectedTableId: number | null;
  selectedChairId: number | null;
}

export interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  icon: string;
  details: string;
}

export interface ReservationDetails {
  venueName: string;
  eventType: string;
  district: string;
  address: string;
  date: string;
  initTime: string;
  endTime: string;
  totalHours: string;
  fullName: string;
  email: string;
  totalAmount: number;
  venueSubtotal?: number;
  pricePerHour?: number;
  guestCount?: number;
  celular?: string;
  mandatoryServicesTotal?: number;
}

export interface PaymentState {
  // Steps
  currentStep: number;
  
  // Furniture selection
  selectedFurniture: SelectedFurniture;
  selectedModels: SelectedModels;
  isFurnitureValid: boolean;
  
  // User data
  userData: UserData;
  
  // Payment
  selectedPaymentMethod: PaymentMethod | null;
  approvalCode: string;
  totalAmount: number;
  
  // Reservation details
  reservationDetails: ReservationDetails | null;
  
  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  // Furniture actions
  setSelectedFurniture: (furniture: SelectedFurniture) => void;
  setSelectedModels: (models: SelectedModels) => void;
  setFurnitureValid: (isValid: boolean) => void;
  removeFurniture: (furnitureId: number) => void;
  
  // User data actions
  setUserData: (userData: UserData) => void;
  
  // Payment actions
  setSelectedPaymentMethod: (method: PaymentMethod | null) => void;
  setApprovalCode: (code: string) => void;
  setTotalAmount: (amount: number) => void;
  
  // Reservation actions
  setReservationDetails: (details: ReservationDetails) => void;
  
  // Reset
  resetPaymentState: () => void;
}

const initialState = {
  currentStep: 1,
  selectedFurniture: {},
  selectedModels: {
    selectedTableId: null,
    selectedChairId: null,
  },
  isFurnitureValid: false,
  userData: {
    email: "",
    nombres: "",
    apellidos: "",
    dni: "",
    celular: "",
  },
  selectedPaymentMethod: null,
  approvalCode: "",
  totalAmount: 0,
  reservationDetails: null,
};

export const usePaymentStore = create<PaymentState>((set, get) => ({
  ...initialState,
  
  // Step actions
  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  previousStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
  
  // Furniture actions
  setSelectedFurniture: (furniture) => {
    set({ selectedFurniture: furniture });
    
    // Auto-validate furniture selection
    const { selectedModels } = get();
    const hasSelectedTable = selectedModels.selectedTableId !== null && 
                            furniture[selectedModels.selectedTableId] > 0;
    const hasSelectedChair = selectedModels.selectedChairId !== null && 
                            furniture[selectedModels.selectedChairId] > 0;
    
    const isValid = hasSelectedTable && hasSelectedChair;
    set({ isFurnitureValid: isValid });
  },
  
  setSelectedModels: (models) => {
    set({ selectedModels: models });
    
    // Revalidate furniture when models change
    const { selectedFurniture } = get();
    const hasSelectedTable = models.selectedTableId !== null && 
                            selectedFurniture[models.selectedTableId] > 0;
    const hasSelectedChair = models.selectedChairId !== null && 
                            selectedFurniture[models.selectedChairId] > 0;
    
    const isValid = hasSelectedTable && hasSelectedChair;
    set({ isFurnitureValid: isValid });
  },
  
  setFurnitureValid: (isValid) => set({ isFurnitureValid: isValid }),
  
  removeFurniture: (furnitureId) => {
    const { selectedFurniture, selectedModels } = get();
    const newSelected = { ...selectedFurniture };
    delete newSelected[furnitureId];
    
    // Update selected models if removed furniture was selected
    let newModels = { ...selectedModels };
    if (selectedModels.selectedTableId === furnitureId) {
      newModels.selectedTableId = null;
    }
    if (selectedModels.selectedChairId === furnitureId) {
      newModels.selectedChairId = null;
    }
    
    set({ 
      selectedFurniture: newSelected,
      selectedModels: newModels,
      isFurnitureValid: false 
    });
  },
  
  // User data actions
  setUserData: (userData) => set({ userData }),
  
  // Payment actions
  setSelectedPaymentMethod: (method) => set({ selectedPaymentMethod: method }),
  setApprovalCode: (code) => set({ approvalCode: code }),
  setTotalAmount: (amount) => set({ totalAmount: amount }),
  
  // Reservation actions
  setReservationDetails: (details) => set({ reservationDetails: details }),
  
  // Reset
  resetPaymentState: () => set(initialState),
}));