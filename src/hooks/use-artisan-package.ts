import { create } from 'zustand';


type PackageStoreProps = {
    id: string
    duration: number
    startDate: string
    endDate: string
}

type PackageStore = {
    artisanPackage: PackageStoreProps
    setPackage: (artisanPackage: Partial<PackageStoreProps>) => void;
};

const initialValues: PackageStoreProps = {
    id: '',
    duration: 0,
    startDate: '',
    endDate: ''
}

export const usePackage = create<PackageStore>()((set) => ({
    artisanPackage: initialValues,
    setPackage: (artisanPackage) => set((state) => ({ artisanPackage: { ...state.artisanPackage, ...artisanPackage } })),
    setClearPackage: () => set({ artisanPackage: initialValues })
}));