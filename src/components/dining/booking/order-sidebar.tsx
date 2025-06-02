"use client";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Trash, ShoppingCart, Minus, Plus } from "lucide-react";
import { calculateOrderTotal, useOrderStore } from "~/hooks/use-dining";
import { useToast } from "~/hooks/use-toast";
import Link from "next/link";

export const OrderSidebar = () => {
  const { items, updateQuantity, removeItem, clearOrder } = useOrderStore();
  const { toast } = useToast();
  const total = calculateOrderTotal(items);

  const handleClearOrder = () => {
    clearOrder();
    toast({
      title: "Order cleared",
      description: "Your order has been cleared",
    });
  };

  return (
    <Card className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-hidden">
      <CardHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <ShoppingCart className="h-5 w-5" />
            <span>Your Order</span>
          </div>
          {items.length > 0 && (
            <Badge variant="outline">
              {items.reduce((acc, item) => acc + item.quantity, 0)} items
            </Badge>
          )}
        </div>
      </CardHeader>

      {items.length > 0 ? (
        <>
          <CardContent className="max-h-[60vh] overflow-y-auto p-0">
            <div className="flex flex-col divide-y">
              {items.map((item) => (
                <div key={item.menuItemId} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="text-right font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          updateQuantity(item.menuItemId, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          updateQuantity(item.menuItemId, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.menuItemId)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col border-t p-4">
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleClearOrder}>
                Clear Order
              </Button>
              <Button asChild>
                <Link href="/dining/booking">Place Order</Link>
              </Button>
            </div>
          </CardFooter>
        </>
      ) : (
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <ShoppingCart className="mb-2 h-10 w-10 text-muted-foreground/50" />
          <h3 className="mb-1 font-medium">Your order is empty</h3>
          <p className="text-sm text-muted-foreground">
            Add items from the menu to start your order
          </p>
        </CardContent>
      )}
    </Card>
  );
};
