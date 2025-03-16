import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import Image from "next/image";
import {
  MapPin,
  Star,
  Clock,
  ShoppingBag,
  Store,
  Calendar,
  CheckCircle2,
  DollarSign,
  Package,
} from "lucide-react";
import { HeadlingUnderline } from "~/components/common/heading-underline";

import dayjs from "dayjs";

type PageProps = {
  searchParams: Promise<{ shopId: string }>;
};

export default async function ShopPage({ searchParams }: PageProps) {
  const paramProps = await searchParams;
  const shop: ShopDetailProps = await api.shop.getShopDetail({
    shopId: paramProps.shopId,
  });

  return (
    <Tabs defaultValue="general" className="w-full">
      <div className="relative flex flex-col items-center pb-6">
        <div className="flex gap-2">
          <div className="relative -mt-[14rem] h-[15rem] w-[15rem] overflow-hidden rounded-lg shadow-lg">
            <Image
              src={shop.dp}
              alt="Profile photo"
              priority
              className="rounded-lg object-cover"
              fill
              sizes="100%"
            />
            <div className="absolute bottom-0 left-0 right-0 h-[4rem] bg-gradient-to-t from-[#9a5d33] to-transparent p-4">
              <h2 className="text-center text-3xl font-semibold text-white">
                {shop.shopName}
              </h2>
            </div>
          </div>
          <TabsList className="relative -mt-[12rem] flex h-auto flex-wrap items-end justify-end gap-2 bg-transparent p-0">
            {[
              { id: "general", label: "General Info." },
              { id: "products", label: "Products" },
              { id: "contact", label: "Contact" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="rounded-b-none rounded-t-lg bg-gray-200 px-4 py-2 font-text text-lg text-gray-950 backdrop-blur hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <span className="mr-2">+</span>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-white/90 p-6 text-gray-900 shadow-lg backdrop-blur">
        <TabsContent value="general" className="grid gap-6">
          <HeadlingUnderline title="General Information" />
          <div className="rounded-lg bg-primary p-8 text-white shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  {/* Star Rating */}
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <Star
                          key={index}
                          className={`h-6 w-6 transition-colors duration-200 ${
                            index < 5
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300"
                          }`}
                        />
                      ))}
                  </div>

                  <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                    <span className="text-xs text-white/70">Member Since</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-400" />
                      <span className="text-base font-medium">
                        {dayjs(shop.createdAt).format("MMM DD, YYYY")}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                    <span className="text-xs text-white/70">Total Products</span>
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-blue-400" />
                      <span className="text-base font-medium">
                        {shop.products.length} Products Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-white/70">Shop Type</span>
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-green-400" />
                    <span className="text-base font-medium">Artisan Crafts</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                  <span className="text-xs text-white/70">Last Updated</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-400" />
                    <span className="text-base font-medium">
                      {dayjs(shop.updatedAt).format("MMM DD, YYYY")}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 rounded p-2 transition-colors duration-200 hover:bg-white/5">
                  <MapPin className="h-5 w-5" />
                  <span className="text-base">{shop.address}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <h2 className="border-b border-gray-200 pb-3 text-xl font-semibold text-gray-800">
              About the Shop
            </h2>
            <p className="text-base leading-relaxed text-gray-700">
              {shop.description || "No description provided for this shop."}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="products" className="grid gap-6">
          <HeadlingUnderline title="Available Products" />
          {shop.products.length > 0 ? (
            shop.products.map((product) => (
              <div
                key={product.productId}
                className="rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-52">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0] ?? "/placeholder.png"}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 208px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-heading text-xl font-semibold text-secondary">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-text">{product.category}</p>
                      </div>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6">{product.description}</p>

                    <div className="grid gap-4">
                      <p className="font-heading text-secondary text-lg">Features </p>
                      {["Handcrafted with care", "Premium quality materials", "Unique design"].map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-secondary" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:w-64 flex flex-col justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Price:</span>
                        <span className="text-xl font-semibold text-primary">
                          ${product.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Updated: {dayjs(product.updatedAt).format("MMM DD, YYYY")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Stock: {product.stock} {product.stock === 1 ? "unit" : "units"}
                        </span>
                      </div>
                    </div>

                    <button className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900">No products yet</h3>
              <p className="mt-2 text-gray-500">
                This shop hasn&apos;t added any products yet.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="contact" className="grid gap-8">
          <HeadlingUnderline title="Contact the Shop" />
          
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg bg-primary p-8 text-white shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <Store className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm text-white/70">Shop Name</span>
                    <p className="font-medium text-lg">{shop.shopName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm text-white/70">Address</span>
                    <p className="font-medium text-lg">{shop.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm text-white/70">Payment Methods</span>
                    <p className="font-medium text-lg">Credit Cards, PayPal, Bank Transfer</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm text-white/70">Business Hours</span>
                    <p className="font-medium text-lg">Mon-Fri: 9AM-6PM, Sat: 10AM-4PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Send a Message</h3>
              <ContactForm shopId={shop.shopId} shopName={shop.shopName} />
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}

// Contact form component (placeholder)
function ContactForm({ shopId, shopName }: { shopId: string; shopName: string }) {
  return (
    <form className="space-y-4">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            id="name" 
            type="text"
            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-primary focus:ring-primary"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input 
            id="email" 
            type="email"
            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-primary focus:ring-primary"
            placeholder="john@example.com" 
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <input 
          id="subject"
          type="text"
          className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-primary focus:ring-primary"
          placeholder={`Question about ${shopName}`} 
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-primary focus:ring-primary"
          placeholder="Your message here..."
        ></textarea>
      </div>
      
      <button type="submit" className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors">
        Send Message
      </button>
    </form>
  );
}