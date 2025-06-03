import { create } from "zustand";
import { persist } from "zustand/middleware";

type RoomDataProps = {
  adults: number;
  children: number;
  quantity: number;
  startDate: string | null;
  endDate: string | null;
  rrpId: string | null;
};

type PackageStoreProps = {
  openBooking: boolean;
  roomData: RoomDataProps;
};

type HotelPackageProps = {
  openBooking: boolean;
  roomData: RoomDataProps; 
  setRoomData: (roomData: Partial<RoomDataProps>) => void;
  setOpenBooking: (openBooking: boolean) => void;
  setDateRange: (startDate: string | null, endDate?: string | null) => void;
  setRrpId: (rrpId: string | null) => void;
  clearDates: () => void;
  clearPackage: () => void;
};

const initialValues: PackageStoreProps = {
  openBooking: false,
  roomData: {
    adults: 0,
    children: 0,
    quantity: 0,
    startDate: null,
    endDate: null,
    rrpId: null,
  },
};

export const useRoom = create<HotelPackageProps>()(
  persist(
    (set) => ({
      ...initialValues,
      setRoomData: (roomData) => 
        set((state) => ({
          roomData: { ...state.roomData, ...roomData }
        })),
      setOpenBooking: (openBooking) => set({ openBooking }),
      setDateRange: (startDate, endDate = null) => 
        set((state) => ({
          roomData: { 
            ...state.roomData, 
            startDate, 
            endDate 
          }
        })),
      setRrpId: (rrpId) => 
        set((state) => ({
          roomData: { 
            ...state.roomData, 
            rrpId 
          }
        })),
      clearDates: () => 
        set((state) => ({
          roomData: { 
            ...state.roomData, 
            startDate: null, 
            endDate: null 
          }
        })),
      clearPackage: () => set({ ...initialValues }),
    }),
    {
      name: "ARTSAY-ROOM-BOOKING",
    },
  ),
);