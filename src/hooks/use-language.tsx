import { create } from 'zustand';

type LanguageServiceStoreProps = {
  id: string;
  service: LanguageServiceProps | null;
  bookingDate: string;
  bookingTime: string;
};

type LanguageServiceStore = {
  languageService: LanguageServiceStoreProps;
  setService: (service: LanguageServiceProps) => void;
  setBookingDate: (date: string) => void;
  setBookingTime: (time: string) => void;
  clearService: () => void;
};

const initialValues: LanguageServiceStoreProps = {
  id: '',
  service: null,
  bookingDate: '',
  bookingTime: ''
};

export const useLanguageService = create<LanguageServiceStore>()((set) => ({
  languageService: initialValues,
  setService: (service) => set({
    languageService: { 
      id: service.languageServiceId,
      service: service,
      bookingDate: '',
      bookingTime: ''
    }
  }),
  setBookingDate: (date) => set((state) => ({
    languageService: {
      ...state.languageService,
      bookingDate: date
    }
  })),
  setBookingTime: (time) => set((state) => ({
    languageService: {
      ...state.languageService,
      bookingTime: time
    }
  })),
  clearService: () => set({ languageService: initialValues })
}));