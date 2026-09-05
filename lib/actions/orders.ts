"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createOrderAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const customerName = formData.get("customerName") as string;
  const customerEmail = formData.get("customerEmail") as string;
  const customerPhone = formData.get("customerPhone") as string;
  const street = formData.get("street") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const postalCode = formData.get("postalCode") as string;
  const country = formData.get("country") as string;

  if (!customerName || !customerEmail || !street || !city || !country) {
    redirect(`/checkout?error=${encodeURIComponent("Please fill in all required shipping fields.")}`);
  }

  if (!user) {
    redirect(`/login?redirectTo=/checkout`);
  }

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!cart) {
    redirect(`/cart?error=${encodeURIComponent("Cart not found.")}`);
  }

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, product:products(*)")
    .eq("cart_id", cart.id);

  if (!cartItems || cartItems.length === 0) {
    redirect("/cart");
  }

  let subtotal = 0;
  const itemsToInsert = cartItems.map((item) => {
    const product = item.product as unknown as { price: number; name: string };
    const price = product?.price || 0;
    const name = product?.name || "Product";
    subtotal += price * item.quantity;
    return {
      product_id: item.product_id,
      product_name_snapshot: name,
      unit_price: price,
      quantity: item.quantity,
    };
  });

  const shippingCost = subtotal > 100 ? 0 : 15;
  const tax = 0; // VAT is inclusive
  const total = subtotal + shippingCost;
  const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      shipping_address: { street, city, state, postal_code: postalCode, country },
      status: "pending",
      payment_status: "unpaid",
      subtotal,
      shipping_cost: shippingCost,
      tax,
      total,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    redirect(`/checkout?error=${encodeURIComponent(orderError?.message || "Failed to create order.")}`);
  }

  const orderItemsWithOrderId = itemsToInsert.map((item) => ({
    ...item,
    order_id: order.id,
  }));

  await supabase.from("order_items").insert(orderItemsWithOrderId);

  await supabase.from("cart_items").delete().eq("cart_id", cart.id);

  revalidatePath("/cart");
  revalidatePath("/account/orders");

  redirect(`/account/orders/${order.id}`);
}
