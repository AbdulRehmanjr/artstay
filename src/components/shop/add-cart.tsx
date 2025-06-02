"use client";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCartStore } from "~/hooks/use-shop";

type AddToCartProps = {
  product: {
    productId: string;
    name: string;
    price: number;
    category: string;
    image: string;
  };
  shopId: string;
};

export const AddToCart = ({ product, shopId }: AddToCartProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem, setShopId } = useCartStore();

  const handleAddToCart = () => {
    // Set shop ID if needed
    setShopId(shopId);
    // Add item to cart
    addItem(product, quantity);
    // Reset quantity
    setQuantity(1);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-lg border">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <span className="w-8 text-center">{quantity}</span>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => setQuantity(quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button className="flex-1" onClick={handleAddToCart}>
        <ShoppingCart className="mr-2 h-4 w-4" />
        Add to Cart
      </Button>
    </div>
  );
};