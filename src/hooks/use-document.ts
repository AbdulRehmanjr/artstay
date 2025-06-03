import { create } from 'zustand';

type DocumentorBookingStoreProps = {
  id: string;
  package: DocumentorPackageProps | null;
  date: string;
};

type DocumentorBookingStore = {
  documentorBooking: DocumentorBookingStoreProps;
  setPackage: (pkg: DocumentorPackageProps) => void;
  setDate: (date: string) => void;
  clearBooking: () => void;
};

const initialValues: DocumentorBookingStoreProps = {
  id: '',
  package: null,
  date: ''
};

export const useDocumentorBooking = create<DocumentorBookingStore>()((set) => ({
  documentorBooking: initialValues,
  setPackage: (pkg) => set({
    documentorBooking: { 
      id: pkg.packageId,
      package: pkg,
      date: ''
    }
  }),
  setDate: (date) => set((state) => ({
    documentorBooking: {
      ...state.documentorBooking,
      date
    }
  })),
  clearBooking: () => set({ documentorBooking: initialValues })
}));