export type FoodCategory =
  | "Pizza"
  | "Burger"
  | "Biryani"
  | "South Indian"
  | "Healthy"
  | "Dessert"
  | "Drinks";

export type Language = "en" | "hi" | "ta";

export type UpiApp = "gpay" | "phonepe" | "paytm" | "bhim";

export interface Restaurant {
  id: string;
  name: string;
  cuisines: string[];
  rating: number;
  ratingCount: number;
  deliveryMinutes: number;
  deliveryFee: number;
  minOrder: number;
  distance: string;
  accentColor: string;
  offer?: string;
  isVegOnly?: boolean;
  imageUrl?: string;
}

export interface SavedAddress {
  id: string;
  label: "Home" | "Office" | "Friend's Home" | "Other";
  address: string;
  landmark?: string;
}

export interface HciPin {
  n: number;
  family: string;
  title: string;
  feature: string;
  why: string;
  pin: { x: number; y: number };
}

export interface HciScreenData {
  label: string;
  route: string;
  desc: string;
  pins: HciPin[];
}

export type TrackingStage = "Order Received" | "Food Cooking" | "Out for Delivery";

export type PaymentMethod = "UPI" | "Card" | "COD";
export type SearchPriceBand = "Any" | "Under200" | "200to300" | "Above300";

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  imageUrl: string;
  prepMinutes: number;
  rating: number;
  isVeg: boolean;
  isEgg?: boolean;
  restaurantId?: string;
  isJain?: boolean;
  isHalal?: boolean;
  allergies?: ("dairy" | "gluten" | "peanut")[];
  spiceLevel?: "Mild" | "Medium" | "Hot" | "Extra Hot" | "Chef's Spice";
  isBestseller?: boolean;
  orderCountThisWeek?: number;
}

export interface CartLine {
  item: FoodItem;
  quantity: number;
}

export interface CheckoutForm {
  address: string;
  paymentMethod: PaymentMethod;
  upiApp?: UpiApp;
  tipAmount: number;
  payItForward: boolean;
}

export interface PriceBreakdown {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  platformFee: number;
  packingCharges: number;
  tipAmount: number;
  couponDiscount: number;
  total: number;
}

export interface SearchFilters {
  vegOnly: boolean;
  ratingAtLeastFour: boolean;
  priceBand: SearchPriceBand;
  maxPrepMinutes: number | null;
}

export interface OrderHistoryItem {
  id: string;
  lines: CartLine[];
  total: number;
  placedAtISO: string;
  etaMinutes: number;
  status: TrackingStage;
  restaurantName: string;
  restaurantAddress: string;
  driverName: string;
}

export interface FavoriteOrder {
  id: string;
  name: string;
  lines: CartLine[];
}

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  defaultAddress: string;
}

export interface SupportTicketDraft {
  topic: string;
  message: string;
}

export type DestructiveTarget =
  | { type: "delete_account" }
  | { type: "delete_favorite"; favoriteId: string; favoriteName: string };
