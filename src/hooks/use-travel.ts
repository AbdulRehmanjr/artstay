import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PackageStoreProps = {
  id: string;
  tour: TravelTourProps | null;
  startDate: string;
  endDate: string | null;
  numberOfPeople: number;
}

type TravelPackageStore = {
  travelPackage: PackageStoreProps;
  setPackage: (travelPackage: Partial<PackageStoreProps>) => void;
  setTour: (tour: TravelTourProps) => void;
  clearPackage: () => void;
};

const initialValues: PackageStoreProps = {
  id: '',
  tour: null,
  startDate: '',
  endDate: null,
  numberOfPeople: 1
}

export const useTravel = create<TravelPackageStore>()(
  persist(
    (set) => ({
      travelPackage: initialValues,
      setPackage: (travelPackage) => set((state) => ({ 
        travelPackage: { ...state.travelPackage, ...travelPackage } 
      })),
      setTour: (tour) => set((state) => ({ 
        travelPackage: { 
          ...state.travelPackage, 
          id: tour.tourId,
          tour: tour,
          // Reset dates when changing tour
          startDate: '',
          endDate: null
        } 
      })),
      clearPackage: () => set({ travelPackage: initialValues })
    }),
    {
      name: 'ARTSAY-TRAVEL',
    }
  )
);