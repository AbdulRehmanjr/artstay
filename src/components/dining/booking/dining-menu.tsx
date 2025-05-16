"use client";
import { Utensils } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { MenuItem } from "./menu-item";
import { OrderSidebar } from "./order-sidebar";

type MenuCategory = "STARTER" | "MAIN_COURSE" | "DESSERT" | "BEVERAGE";

// Menu item type
type RestaurantMenuProps = {
  menuItemId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spicyLevel: number;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Category labels
const CATEGORY_LABELS: Record<MenuCategory, string> = {
  STARTER: "Starters",
  MAIN_COURSE: "Main Courses",
  DESSERT: "Desserts",
  BEVERAGE: "Beverages",
};

// Category colors
const CATEGORY_COLORS: Record<MenuCategory, string> = {
  STARTER: "from-amber-600 to-amber-400",
  MAIN_COURSE: "from-orange-600 to-orange-400",
  DESSERT: "from-pink-600 to-pink-400",
  BEVERAGE: "from-blue-600 to-blue-400",
};

type ComponentProps = {
  menu: RestaurantMenuProps[];
};

export const DiningMenu = ({ menu }: ComponentProps) => {
  // Group menu items by category
  const categorizedMenu = menu.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<MenuCategory, RestaurantMenuProps[]>,
  );

  const restaurantId = menu.length > 0 ? menu[0]?.restaurantId : "";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Menu items - takes up 2/3 of the width on large screens */}
      <div className="space-y-8 lg:col-span-2">
        {/* Show all categories by default */}
        {(Object.keys(categorizedMenu) as MenuCategory[]).map((category) => (
          <div key={category} className="space-y-4">
            <div
              className={`mb-4 flex items-center justify-between rounded-lg bg-gradient-to-r ${CATEGORY_COLORS[category]} p-4 shadow-md`}
            >
              <div className="flex items-center gap-2">
                <Utensils className="h-6 w-6 text-white" />
                <h3 className="text-2xl font-bold text-white">
                  {CATEGORY_LABELS[category]}
                </h3>
              </div>
              <Badge className="bg-white px-3 py-1 text-sm font-medium text-gray-800">
                {categorizedMenu[category].length} items
              </Badge>
            </div>

            <div className="space-y-4">
              {categorizedMenu[category].map((item) => (
                <MenuItem
                  key={item.menuItemId}
                  item={item}
                  restaurantId={restaurantId ??' '}
                />
              ))}
            </div>

            {categorizedMenu[category].length === 0 && (
              <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                <p className="text-gray-500">No items in this category</p>
              </div>
            )}
          </div>
        ))}

        {Object.keys(categorizedMenu).length === 0 && (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
            <p className="text-gray-500">No menu items available</p>
          </div>
        )}
      </div>

      {/* Order sidebar - takes up 1/3 of the width on large screens */}
      <div className="lg:col-span-1">
        <OrderSidebar />
      </div>
    </div>
  );
};
