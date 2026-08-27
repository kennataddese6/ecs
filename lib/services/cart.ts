import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { CartItemWithProduct } from "@/lib/types";
import { getProductById } from "@/lib/services/products";

export async function getCart(): Promise<{ cartId: string | null; items: CartItemWithProduct[] }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("lumen_session_id")?.value;

    let cartId: string | null = null;

    if (user) {
      const { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cart) {
        cartId = cart.id;
      }
    } else if (sessionId) {
      const { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (cart) {
        cartId = cart.id;
      }
    }

    if (cartId) {
      const { data: items } = await supabase
        .from("cart_items")
        .select("*, product:products(*, product_images(*))")
        .eq("cart_id", cartId)
        .order("created_at", { ascending: true });

      const rawItems = (items as unknown as CartItemWithProduct[]) || [];

      const validItems = rawItems.filter(
        (item) => item.product && item.product.active
      );

      if (validItems.length > 0) {
        return {
          cartId,
          items: validItems,
        };
      }
    }
  } catch (e) {}

  const cookieStore = await cookies();
  const guestCartCookie = cookieStore.get("lumen_guest_cart")?.value;

  if (guestCartCookie) {
    try {
      const parsedItems: Array<{ id: string; product_id: string; quantity: number }> = JSON.parse(guestCartCookie);
      const itemsWithProducts = await Promise.all(
        parsedItems.map(async (item) => {
          const product = await getProductById(item.product_id);
          if (!product) return null;
          return {
            id: item.id,
            cart_id: "cookie-cart",
            product_id: item.product_id,
            quantity: item.quantity,
            price_snapshot: product.price,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            product: product,
          } as CartItemWithProduct;
        })
      );

      const validItems = itemsWithProducts.filter((i): i is CartItemWithProduct => i !== null);
      if (validItems.length > 0) {
        return { cartId: "cookie-cart", items: validItems };
      }
    } catch (e) {}
  }

  return { cartId: null, items: [] };
}

export async function clearCart(cartId?: string | null): Promise<void> {
  try {
    const supabase = await createClient();
    if (cartId && cartId !== "cookie-cart") {
      await supabase.from("cart_items").delete().eq("cart_id", cartId);
    }
  } catch (e) {}

  try {
    const cookieStore = await cookies();
    cookieStore.delete("lumen_guest_cart");
  } catch (e) {}
}
