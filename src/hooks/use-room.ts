import { create } from "zustand";
import { persist } from "zustand/middleware";

type RoomDataProps = {
  adults: number;
  children: number;
  quantity: number;
  startDate: string | null;
  endDate: string | null;
  rrpId: string | null;
  totalPrice: number;
  duration: number;
  roomId: string | null;
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
  setTotalPrice: (totalPrice: number) => void;
  setDuration: (duration: number) => void;
  setRoomId: (roomId: string | null) => void;
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
    totalPrice: 0,
    duration: 0,
    roomId: null,
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
      setDateRange: (startDate, endDate) => 
        set((state) => ({
          roomData: { 
            ...state.roomData, 
            startDate, 
            endDate: endDate ?? null,
            totalPrice: 0,
            duration: 0
          }
        })),
      setRrpId: (rrpId) => 
        set((state) => ({
          roomData: { 
            ...state.roomData, 
            rrpId 
          }
        })),
      setTotalPrice: (totalPrice) => 
        set((state) => ({
          roomData: { 
            ...state.roomData, 
            totalPrice 
          }
        })),
      setDuration: (duration) => 
        set((state) => ({
          roomData: { 
            ...state.roomData, 
            duration 
          }
        })),
      setRoomId: (roomId) => 
        set((state) => ({
          roomData: { 
            ...state.roomData, 
            roomId 
          }
        })),
      clearDates: () => 
        set((state) => ({
          roomData: { 
            ...state.roomData, 
            startDate: null, 
            endDate: null,
            totalPrice: 0,
            duration: 0,
            roomId: null
          }
        })),
      clearPackage: () => set({ ...initialValues }),
    }),
    {
      name: "ARTSAY-ROOM-BOOKING",
    },
  ),
);