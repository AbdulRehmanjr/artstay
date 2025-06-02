import { create } from 'zustand';


type FairEventStoreProps = {
  id: string;
  event: FairEventProps | null;
  date: string;
};

type FairEventStore = {
  fairEvent: FairEventStoreProps;
  setEvent: (event: FairEventProps) => void;
  setDate: (date: string) => void;
  clearEvent: () => void;
};

const initialValues: FairEventStoreProps = {
  id: '',
  event: null,
  date: ''
};

export const useFairEvent = create<FairEventStore>()((set) => ({
  fairEvent: initialValues,
  setEvent: (event) => set({
    fairEvent: { 
      id: event.eventId,
      event: event,
      date: ''
    }
  }),
  setDate: (date) => set((state) => ({
    fairEvent: {
      ...state.fairEvent,
      date
    }
  })),
  clearEvent: () => set({ fairEvent: initialValues })
}));