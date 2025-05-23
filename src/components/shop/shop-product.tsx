"use client";
import { ShoppingBag } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { ProductItem } from "~/components/shop/product-item";
import { CartSidebar } from "~/components/shop/shop-sidebar";


// Category labels
const getCategoryLabel = (category: string) => {
  const categoryMap: Record<string, string> = {
    "pashmina": "Pashmina & Woolen Products",
    "embroidery": "Embroidery & Textiles",
    "papierMache": "Papier-Mâché Artworks",
    "woodCarving": "Wood Carving & Furniture",
    "copperware": "Copperware & Metal Engraving",
    "pottery": "Pottery & Ceramics",
    "wickerwork": "Wickerwork & Basketry",
    "khatamband": "Khatamband & Woodwork",
    "jewelry": "Handmade Jewelry",
    "leather": "Leather Goods"
  };

  if (category.startsWith("other: ")) {
    return category.substring(7);
  }
  
  return categoryMap[category] ?? category;
};

type ComponentProps = {
  products: ProductProps[];
  shopId: string;
};

export const ShopProducts = ({ products, shopId }: ComponentProps) => {
  // Group products by category
  const categorizedProducts = products.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      (acc[item.category] ??= []).push(item);
      return acc;
    },
    {} as Record<string, ProductProps[]>,
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Products - takes up 2/3 of the width on large screens */}
      <div className="space-y-8 lg:col-span-2">
        {/* Show all categories by default */}
        {Object.keys(categorizedProducts).map((category) => (
          <div key={category} className="space-y-4">
            <div
              className="mb-4 flex items-center justify-between rounded-lg bg-gradient-to-r from-amber-600 to-amber-400 p-4 shadow-md"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-white" />
                <h3 className="text-2xl font-bold text-white">
                  {getCategoryLabel(category)}
                </h3>
              </div>
              <Badge className="bg-white px-3 py-1 text-sm font-medium text-gray-800">
                {categorizedProducts[category]?.length ?? 0} items
              </Badge>
            </div>

            <div className="space-y-4">
              {categorizedProducts[category]?.map((item) => (
                <ProductItem
                  key={item.productId}
                  product={item}
                  shopId={shopId}
                />
              ))}
            </div>

            {categorizedProducts[category]?.length === 0 && (
              <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                <p className="text-gray-500">No products in this category</p>
              </div>
            )}
          </div>
        ))}

        {Object.keys(categorizedProducts).length === 0 && (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
            <p className="text-gray-500">No products available</p>
          </div>
        )}
      </div>

      {/* Cart sidebar - takes up 1/3 of the width on large screens */}
      <div className="lg:col-span-1">
        <CartSidebar />
      </div>
    </div>
  );
};