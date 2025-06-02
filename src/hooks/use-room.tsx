import { create } from "zustand";
import { persist } from "zustand/middleware";

type RoomDataProps = {
  adults: number;
  children: number;
  quantity : number
};
type PackageStoreProps = {
  openBooking: boolean;
  roomData: RoomDataProps;
};

type SafariPackageStore = {
  openBooking: boolean;
  roomData: RoomDataProps; 
  setRoomData: (roomData: Partial<RoomDataProps>) => void;
  setOpenBooking: (openBooking: boolean) => void;
  clearPackage: () => void;
};

const initialValues: PackageStoreProps = {
  openBooking: false,
  roomData: {
    adults: 0,
    children: 0,
    quantity:0,
  },
};

export const useRoom = create<SafariPackageStore>()(
  persist(
    (set) => ({
      ...initialValues,
      setRoomData: (roomData) => 
        set((state) => ({
          roomData: { ...state.roomData, ...roomData }
        })),
      setOpenBooking: (openBooking) => set({ openBooking }),
      clearPackage: () => set({ ...initialValues }),
    }),
    {
      name: "ARTSAY-ROOM-BOOKING",
    },
  ),
);