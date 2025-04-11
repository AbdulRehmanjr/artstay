import { create } from "zustand";

type LoginDialogProps = {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
};

export const useLogin = create<LoginDialogProps>((set) => ({
  isLogin: false,
  setIsLogin: (isLogin) => set({ isLogin }),
}));