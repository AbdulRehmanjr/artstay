import { create } from "zustand";
import { persist } from "zustand/middleware";

type PackageStoreProps = {
  id: string;
  artisanId:string
  title: string;
  amount: number;
  duration: number;
  startDate: string;
  endDate: string;
};

type PackageStore = {
  artisanPackage: PackageStoreProps;
  setPackage: (artisanPackage: Partial<PackageStoreProps>) => void;
  setClearPackage: () => void;
};

const initialValues: PackageStoreProps = {
  id: "",
  title: "",
  amount: 0,
  duration: 0,
  startDate: "",
  endDate: "",
  artisanId:''
};

export const usePackage = create<PackageStore>()(
  persist(
    (set) => ({
      artisanPackage: initialValues,
      setPackage: (artisanPackage) =>
        set((state) => ({
          artisanPackage: { ...state.artisanPackage, ...artisanPackage },
        })),
      setClearPackage: () => set({ artisanPackage: initialValues }),
    }),
    {
      name: "ARTYSAY-ARTISAN",
    }
  )
);