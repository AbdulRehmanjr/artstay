"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Simple types for our store
type Product = {
  productId: string;
  name: string;
  price: number;
  category: string;
  image: string;
};

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
};

type CartStore = {
  // State
  items: CartItem[];
  shopId: string | null;

  // Actions
  addItem: (item: Product, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setShopId: (id: string) => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      shopId: null,
      addItem: (item, quantity) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (cartItem) => cartItem.productId === item.productId,
          );

          if (existingItemIndex !== -1) {
            const updatedItems = [...state.items];
            const existingItem = updatedItems[existingItemIndex];
            if (!existingItem) {
              return { items: updatedItems };
            }
            updatedItems[existingItemIndex] = {
              productId: existingItem.productId,
              name: existingItem.name,
              price: existingItem.price,
              category: existingItem.category,
              image: existingItem.image,
              quantity: (existingItem.quantity ?? 0) + quantity,
            };

            return { items: updatedItems };
          } else {
            return {
              items: [
                ...state.items,
                {
                  productId: item.productId,
                  name: item.name,
                  price: item.price,
                  quantity,
                  category: item.category,
                  image: item.image,
                },
              ],
            };
          }
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) => item.productId !== productId,
              ),
            };
          }

          return {
            items: state.items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item,
            ),
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      clearCart: () => set({ items: [] }),

      setShopId: (id) => set({ shopId: id }),
    }),
    {
      name: "ARTSTAY-SHOP",
    },
  ),
);

// Helper function for getting cart total
export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};