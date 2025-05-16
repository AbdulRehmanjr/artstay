"use client";
import React from "react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { AddToOrder } from "~/components/dining/booking/order-button";

// Map for spicy level colors
const spicyColorMap: Record<number, string> = {
  1: "border-red-400 text-red-400",
  2: "border-red-500 text-red-500",
  3: "border-red-500 text-red-500",
  4: "border-red-600 text-red-600",
  5: "border-red-600 text-red-600",
};

// Spicy level labels
const SPICY_LEVELS = [
  { value: 0, label: "Not Spicy" },
  { value: 1, label: "Mild" },
  { value: 2, label: "Medium" },
  { value: 3, label: "Hot" },
  { value: 4, label: "Very Hot" },
  { value: 5, label: "Extreme" },
];

type MenuItemProps = {
  menuItemId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spicyLevel: number;
  restaurantId: string;
};

export const MenuItem = ({ item, restaurantId }: { item: MenuItemProps; restaurantId: string }) => {
  return (
    <Card className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="relative h-48 md:h-full">
          <Image
            src={item.image || "/placeholder.png"}
            alt={item.name}
            fill
            className="object-cover"
          />
          
          {/* Price badge */}
          <div className="absolute right-0 top-4">
            <div className="bg-primary px-3 py-1 text-white">
              ${item.price.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between p-4 md:col-span-2">
          <div>
            <h3 className="text-xl font-medium">{item.name}</h3>
            
            <div className="my-2 flex flex-wrap gap-1">
              <TooltipProvider>
                {item.isVegetarian && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="border-green-500 bg-green-500/10 text-green-800">
                        Vegetarian
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Vegetarian dish</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {item.isVegan && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="border-green-600 bg-green-600/10 text-green-900">
                        Vegan
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Vegan dish</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {item.isGlutenFree && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="border-yellow-500 bg-yellow-500/10 text-yellow-800">
                        Gluten Free
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Gluten free dish</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {item.spicyLevel > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className={`${spicyColorMap[item.spicyLevel] ?? ""}`}>
                        Spicy: {Array(item.spicyLevel).fill("🌶️").join("")}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {SPICY_LEVELS.find(
                          (l) => l.value === item.spicyLevel
                        )?.label ?? "Spicy"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
            
            <p className="mb-4 text-gray-700">{item.description}</p>
          </div>
          
          <AddToOrder 
            menuItem={{ 
              menuItemId: item.menuItemId, 
              name: item.name, 
              price: item.price, 
              category: item.category 
            }}
            restaurantId={restaurantId}
          />
        </div>
      </div>
    </Card>
  );
};