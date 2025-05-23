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
import { AddToCart } from "~/components/shop/add-cart";



export const ProductItem = ({ product, shopId }: { product: ProductProps; shopId: string }) => {
  return (
    <Card className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="relative h-48 md:h-full">
          <Image
            src={product.images?.[0] ?? "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
          
          {/* Price badge */}
          <div className="absolute right-0 top-4">
            <div className="bg-primary px-3 py-1 text-white">
              ${product.price.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between p-4 md:col-span-2">
          <div>
            <h3 className="text-xl font-medium">{product.name}</h3>
            
            <div className="my-2 flex flex-wrap gap-1">
              <TooltipProvider>
                {product.artisanMade && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="border-amber-500 bg-amber-500/10 text-amber-800">
                        Artisan Made
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Handcrafted by local artisans</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {product.stock > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="border-green-500 bg-green-500/10 text-green-800">
                        In Stock
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{product.stock} available</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {product.material && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="border-blue-500 bg-blue-500/10 text-blue-800">
                        {product.material}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Made with {product.material}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {product.craftType && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="border-purple-500 bg-purple-500/10 text-purple-800">
                        {product.craftType}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Craft type: {product.craftType}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
            
            <p className="mb-4 text-gray-700">{product.description}</p>
          </div>
          
          <AddToCart 
            product={{ 
              productId: product.productId, 
              name: product.name, 
              price: product.price, 
              category: product.category,
              image: product.images?.[0] ?? "/placeholder.png"
            }}
            shopId={shopId}
          />
        </div>
      </div>
    </Card>
  );
};