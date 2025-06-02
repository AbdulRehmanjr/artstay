import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import Image from "next/image";
import {
  MapPin,
  Clock,
  ShoppingBag,
  Store,
  Calendar,
  CheckCircle2,
  Package,
  Truck,
  CreditCard,
  Tag,
  Info,
  Phone,
  Globe,
  Award,
  PackageCheck,
  CircleDollarSign,
  Timer,
  User,
} from "lucide-react";
import { HeadlingUnderline } from "~/components/common/heading-underline";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import dayjs from "dayjs";
import { ShopProducts } from "~/components/shop/shop-product";

type PageProps = {
  searchParams: Promise<{ shopId: string }>;
};

// Helper function to get readable category names
const getCategoryLabel = (category: string) => {
  const categoryMap: Record<string, string> = {
    pashmina: "Pashmina & Woolen Products",
    embroidery: "Embroidery & Textiles",
    papierMache: "Papier-Mâché Artworks",
    woodCarving: "Wood Carving & Furniture",
    copperware: "Copperware & Metal Engraving",
    pottery: "Pottery & Ceramics",
    wickerwork: "Wickerwork & Basketry",
    khatamband: "Khatamband & Woodwork",
    jewelry: "Handmade Jewelry",
    leather: "Leather Goods",
  };

  if (category.startsWith("other: ")) {
    return category.substring(7);
  }

  return categoryMap[category] ?? category;
};

// Helper function to get pickup option labels
const getPickupLabel = (option: string) => {
  const optionMap: Record<string, string> = {
    shopPickup: "Shop Pickup",
    hotelDelivery: "Hotel Delivery",
    localDelivery: "Local Home/Guesthouse Delivery",
  };

  return optionMap[option] ?? option;
};

// Helper function to get payment method labels
const getPaymentMethodLabel = (method: string) => {
  const methodMap: Record<string, string> = {
    cardPayment: "Credit/Debit Card",
    upi: "UPI",
    paypal: "PayPal",
    cash: "Cash on Pickup",
  };

  return methodMap[method] ?? method;
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
            <div className="absolute bottom-0 left-0 right-0 h-[3rem] bg-gradient-to-t from-[#0088cc] to-transparent p-4">
              <h2 className="text-center text-sm font-semibold text-white">
                {shop.shopName}
              </h2>
            </div>
          </div>
          <TabsList className="relative -mt-[12rem] flex h-auto flex-wrap items-end justify-end gap-2 bg-transparent p-0">
            {[
              { id: "general", label: "General Info" },
              { id: "products", label: "Products" },
              { id: "details", label: "Shop Details" },
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
                  {/* Business Info */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-white/70">Business Name</span>
                    <div className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-purple-400" />
                      <span className="text-base font-medium">
                        {shop.businessName || shop.shopName}
                      </span>
                    </div>
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
                    <span className="text-xs text-white/70">
                      Total Products
                    </span>
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
                  <span className="text-xs text-white/70">Vendor Type</span>
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-green-400" />
                    <span className="text-base font-medium">
                      {shop.vendorType}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 border-l border-white/20 pl-8">
                  <span className="text-xs text-white/70">Business Hours</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-400" />
                    <span className="text-base font-medium">
                      {shop.shopTiming}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 rounded p-2 transition-colors duration-200 hover:bg-white/5">
                  <MapPin className="h-5 w-5" />
                  <span className="text-base">
                    {shop.city}, {shop.state}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Certification Badges */}
          <div className="mt-2 flex flex-wrap gap-3">
            {shop.isGICertified && (
              <Badge className="bg-blue-600 px-3 py-1 text-white">
                <Award className="mr-1 h-4 w-4" /> GI Certified Products
              </Badge>
            )}
            {shop.isHandmade === "Yes" && (
              <Badge className="bg-amber-600 px-3 py-1 text-white">
                <CheckCircle2 className="mr-1 h-4 w-4" /> 100% Handmade Products
              </Badge>
            )}
            {shop.isHandmade === "Mixed" && (
              <Badge className="bg-emerald-600 px-3 py-1 text-white">
                <CheckCircle2 className="mr-1 h-4 w-4" /> Handmade &
                Machine-made Products
              </Badge>
            )}
            {shop.offersCustomization && (
              <Badge className="bg-purple-600 px-3 py-1 text-white">
                <PackageCheck className="mr-1 h-4 w-4" /> Custom Orders
                Available
              </Badge>
            )}
          </div>

          {/* Shop Description */}
          <div className="mt-8 space-y-4">
            <h2 className="border-b border-gray-200 pb-3 text-xl font-semibold text-gray-800">
              About the Shop
            </h2>
            <p className="text-base leading-relaxed text-gray-700">
              {shop.description || "No description provided for this shop."}
            </p>
          </div>

          {/* Product Categories */}
          <div className="mt-6 space-y-4">
            <h2 className="border-b border-gray-200 pb-3 text-xl font-semibold text-gray-800">
              Product Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {shop.productCategories.map((category, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  <Tag className="mr-2 h-4 w-4 text-primary" />
                  {getCategoryLabel(category)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Delivery Options */}
          <div className="mt-6 space-y-4">
            <h2 className="border-b border-gray-200 pb-3 text-xl font-semibold text-gray-800">
              Delivery Options
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {shop.pickupOptions.map((option, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <Truck className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {getPickupLabel(option)}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {option === "shopPickup"
                        ? "Visit our shop to collect your order"
                        : option === "hotelDelivery"
                          ? "We'll deliver to your hotel in Srinagar"
                          : "We deliver to guesthouses and homestays"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <Timer className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium text-gray-900">
                  Delivery Time: {shop.deliveryTime}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Delivery Fee:{" "}
                  {shop.deliveryFee === "Free"
                    ? "Free Delivery"
                    : shop.deliveryFee}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="products" className="grid gap-6">
          <HeadlingUnderline title="Available Products" />
          <ShopProducts products={shop.products} shopId={shop.shopId} />
        </TabsContent>

        <TabsContent value="details" className="grid gap-6">
          <HeadlingUnderline title="Shop Details" />

          <div className="grid gap-6 md:grid-cols-2">
            {/* Business Details */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Business Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Store className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Business Name</p>
                    <p className="text-gray-900">
                      {shop.businessName || shop.shopName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">
                      Owner/Representative
                    </p>
                    <p className="text-gray-900">{shop.ownerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Store className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Vendor Type</p>
                    <p className="text-gray-900">{shop.vendorType}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <h4 className="mb-3 font-medium text-gray-900">Address</h4>
              <div className="rounded-lg bg-gray-50 p-3 text-gray-700">
                <p>{shop.address}</p>
                <p>
                  {shop.city}, {shop.state}, {shop.zipCode}
                </p>
                <p>{shop.country}</p>
              </div>
            </div>

            {/* Inventory & Ordering */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Inventory & Ordering
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <PackageCheck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Stock Availability</p>
                    <p className="text-gray-900">{shop.stockAvailability}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Packaging</p>
                    <p className="text-gray-900">{shop.packagingType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <CircleDollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Pricing Structure</p>
                    <p className="text-gray-900">{shop.pricingStructure}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Info className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Order Processing</p>
                    <p className="text-gray-900">{shop.orderProcessing}</p>
                  </div>
                </div>

                {shop.offersCustomization && (
                  <div className="rounded-lg bg-green-50 p-3 text-green-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <p className="font-medium">Customization Available</p>
                    </div>
                    <p className="mt-1 text-sm">
                      This shop offers custom orders and product personalization
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Opening Hours */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Opening Hours
              </h3>

              <div className="mb-4 flex items-center gap-4">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Shop Timing</p>
                  <p className="text-gray-900">{shop.shopTiming}</p>
                </div>
              </div>

              <h4 className="mb-3 font-medium text-gray-900">Working Days</h4>
              <div className="flex flex-wrap gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <Badge
                      key={day}
                      variant={
                        shop.workingDays.includes(day) ? "default" : "outline"
                      }
                      className={
                        shop.workingDays.includes(day)
                          ? "bg-primary text-white"
                          : "border-gray-200 text-gray-400"
                      }
                    >
                      {day}
                    </Badge>
                  ),
                )}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Payment & Return Policy
              </h3>

              <h4 className="mb-3 font-medium text-gray-900">
                Accepted Payment Methods
              </h4>
              <div className="mb-6 flex flex-wrap gap-2">
                {shop.paymentMethods.map((method, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <CreditCard className="h-3 w-3" />
                    {getPaymentMethodLabel(method)}
                  </Badge>
                ))}
              </div>

              <h4 className="mb-3 font-medium text-gray-900">Return Policy</h4>
              <div className="rounded-lg bg-gray-50 p-3 text-gray-700">
                <p>
                  {shop.returnPolicy ||
                    "Standard return policy applies. Contact the shop for details."}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="grid gap-8">
          <HeadlingUnderline title="Contact the Shop" />

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg bg-primary p-8 text-white shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="mb-6 text-xl font-semibold">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <Store className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm text-white/70">Shop Name</span>
                    <p className="text-lg font-medium">{shop.shopName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm text-white/70">
                      Contact Person
                    </span>
                    <p className="text-lg font-medium">{shop.ownerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm text-white/70">Address</span>
                    <p className="font-medium">{shop.address}</p>
                    <p className="font-medium">
                      {shop.city}, {shop.state} {shop.zipCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm text-white/70">Phone Number</span>
                    <p className="text-lg font-medium">{shop.phoneNumber}</p>
                  </div>
                </div>

                {shop.website && (
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-sm text-white/70">Website</span>
                      <p className="text-lg font-medium">
                        <a
                          href={
                            shop.website.startsWith("http")
                              ? shop.website
                              : `https://${shop.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-white/80"
                        >
                          {shop.website}
                        </a>
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm text-white/70">
                      Business Hours
                    </span>
                    <p className="text-lg font-medium">{shop.shopTiming}</p>
                    <p className="text-sm text-white/80">
                      Working days: {shop.workingDays.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-6 text-xl font-semibold text-gray-900">
                Send a Message
              </h3>
              {/* <ContactForm shopId={shop.shopId} shopName={shop.shopName} /> */}
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
