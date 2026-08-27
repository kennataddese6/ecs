"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getProductById } from "@/lib/services/products";

async function getOrCreateCartId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const cookieStore = await cookies();

    if (user) {
      let { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!cart) {
        const { data: newCart } = await supabase
          .from("carts")
          .insert({ user_id: user.id })
          .select("id")
          .single();

        cart = newCart;
      }

      if (cart?.id) return cart.id;
    }

    let sessionId = cookieStore.get("lumen_session_id")?.value;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      cookieStore.set("lumen_session_id", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: "lax",
      });
    }

    let { data: guestCart } = await supabase
      .from("carts")
      .select("id")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (!guestCart) {
      const { data: newGuestCart } = await supabase
        .from("carts")
        .insert({ session_id: sessionId })
        .select("id")
        .single();

      guestCart = newGuestCart;
    }

    if (guestCart?.id) return guestCart.id;
  } catch (e) {}

  return null;
}

export async function addToCartAction(productId: string, quantityToAdd: number = 1) {
  if (quantityToAdd <= 0) {
    return { error: "Quantity must be at least 1." };
  }

  let product: { id: string; name: string; price: number; stock_quantity: number; active: boolean } | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("id, name, price, stock_quantity, active")
      .eq("id", productId)
      .single();

    if (data) {
      product = data;
    }
  } catch (e) {}

  if (!product) {
    const fallback = await getProductById(productId);
    if (fallback) {
      product = {
        id: fallback.id,
        name: fallback.name,
        price: fallback.price,
        stock_quantity: fallback.stock_quantity,
        active: fallback.active,
      };
    }
  }

  if (!product || !product.active) {
    return { error: "Product is currently unavailable." };
  }

  if (product.stock_quantity <= 0) {
    return { error: `Sorry, "${product.name}" is out of stock.` };
  }

  const cartId = await getOrCreateCartId();
  if (cartId) {
    try {
      const supabase = await createClient();
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("cart_id", cartId)
        .eq("product_id", productId)
        .maybeSingle();

      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const newTotalQuantity = currentQuantity + quantityToAdd;

      if (newTotalQuantity > product.stock_quantity) {
        return {
          error: `Cannot add more. Stock limit reached (${product.stock_quantity} available).`,
        };
      }

      if (existingItem) {
        await supabase
          .from("cart_items")
          .update({ quantity: newTotalQuantity })
          .eq("id", existingItem.id);
      } else {
        await supabase.from("cart_items").insert({
          cart_id: cartId,
          product_id: productId,
          quantity: newTotalQuantity,
        });
      }

      revalidatePath("/cart");
      revalidatePath("/");
      return { success: true };
    } catch (e) {}
  }

  // Cookie-based guest cart fallback for preview environments
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get("lumen_guest_cart")?.value;
  let cookieItems: Array<{ id: string; product_id: string; quantity: number }> = [];
  if (existingCookie) {
    try {
      cookieItems = JSON.parse(existingCookie);
    } catch (e) {}
  }

  const existingCookieItem = cookieItems.find((i) => i.product_id === productId);
  const currentQty = existingCookieItem ? existingCookieItem.quantity : 0;
  const targetQty = currentQty + quantityToAdd;

  if (targetQty > product.stock_quantity) {
    return {
      error: `Cannot add more. Stock limit reached (${product.stock_quantity} available).`,
    };
  }

  if (existingCookieItem) {
    existingCookieItem.quantity = targetQty;
  } else {
    cookieItems.push({ id: `citem-${Date.now()}`, product_id: productId, quantity: targetQty });
  }

  cookieStore.set("lumen_guest_cart", JSON.stringify(cookieItems), { path: "/" });

  revalidatePath("/cart");
  revalidatePath("/");
  return { success: true };
}

export async function updateCartQuantityAction(cartItemId: string, newQuantity: number) {
  if (newQuantity <= 0) {
    return removeFromCartAction(cartItemId);
  }

  try {
    const supabase = await createClient();
    const { data: cartItem } = await supabase
      .from("cart_items")
      .select("id, quantity, product:products(name, stock_quantity, active)")
      .eq("id", cartItemId)
      .single();

    if (cartItem && cartItem.product) {
      const product = cartItem.product as unknown as { name: string; stock_quantity: number; active: boolean };

      if (newQuantity > product.stock_quantity) {
        return {
          error: `Cannot exceed available stock of ${product.stock_quantity} for "${product.name}".`,
        };
      }

      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", cartItemId);

      if (!error) {
        revalidatePath("/cart");
        return { success: true };
      }
    }
  } catch (e) {}

  // Cookie-based update fallback
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get("lumen_guest_cart")?.value;
  if (existingCookie) {
    try {
      const cookieItems: Array<{ id: string; product_id: string; quantity: number }> = JSON.parse(existingCookie);
      const targetItem = cookieItems.find((i) => i.id === cartItemId || i.product_id === cartItemId);
      if (targetItem) {
        targetItem.quantity = newQuantity;
        cookieStore.set("lumen_guest_cart", JSON.stringify(cookieItems), { path: "/" });
      }
    } catch (e) {}
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function removeFromCartAction(cartItemId: string) {
  try {
    const supabase = await createClient();
    await supabase.from("cart_items").delete().eq("id", cartItemId);
  } catch (e) {}

  const cookieStore = await cookies();
  const existingCookie = cookieStore.get("lumen_guest_cart")?.value;
  if (existingCookie) {
    try {
      let cookieItems: Array<{ id: string; product_id: string; quantity: number }> = JSON.parse(existingCookie);
      cookieItems = cookieItems.filter((i) => i.id !== cartItemId && i.product_id !== cartItemId);
      cookieStore.set("lumen_guest_cart", JSON.stringify(cookieItems), { path: "/" });
    } catch (e) {}
  }

  revalidatePath("/cart");
  return { success: true };
}
