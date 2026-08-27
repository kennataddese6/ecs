export * from "./database";
import { ProductWithImages } from "@/lib/services/products";

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CartItemWithProduct {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  price_snapshot: number | null;
  product: ProductWithImages;
}
