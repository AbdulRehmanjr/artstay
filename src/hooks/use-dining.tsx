"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Simple types for our store
type MenuItem = {
  menuItemId: string;
  name: string;
  price: number;
  category: string;
};

type OrderItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
};

type OrderStore = {
  // State
  items: OrderItem[];
  restaurantId: string | null;

  // Actions
  addItem: (item: MenuItem, quantity: number) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  removeItem: (menuItemId: string) => void;
  clearOrder: () => void;
  setRestaurantId: (id: string) => void;
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      items: [],
      restaurantId: null,
      addItem: (item, quantity) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (cartItem) => cartItem.menuItemId === item.menuItemId,
          );

          if (existingItemIndex !== -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              menuItemId: updatedItems[existingItemIndex]?.menuItemId ?? "",
              name: updatedItems[existingItemIndex]?.name ?? "",
              price: updatedItems[existingItemIndex]?.price ?? 0,
              category: updatedItems[existingItemIndex]?.category ?? "",
              quantity:
                (updatedItems[existingItemIndex]?.quantity ?? 0) + quantity,
            };

            return { items: updatedItems };
          } else {
            return {
              items: [
                ...state.items,
                {
                  menuItemId: item.menuItemId,
                  name: item.name,
                  price: item.price,
                  quantity,
                  category: item.category,
                },
              ],
            };
          }
        }),

      updateQuantity: (menuItemId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) => item.menuItemId !== menuItemId,
              ),
            };
          }

          return {
            items: state.items.map((item) =>
              item.menuItemId === menuItemId ? { ...item, quantity } : item,
            ),
          };
        }),

      removeItem: (menuItemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.menuItemId !== menuItemId),
        })),

      clearOrder: () => set({ items: [] }),

      setRestaurantId: (id) => set({ restaurantId: id }),
    }),
    {
      name: "ARTSTAY-DINING",
    },
  ),
);

// Helper function for getting order total
export const calculateOrderTotal = (items: OrderItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};
