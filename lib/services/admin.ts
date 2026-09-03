import { createClient } from "@/lib/supabase/server";

export async function getAdminStats() {
  try {
    const supabase = await createClient();

    const [
      { count: productsCount },
      { count: activeProductsCount },
      { count: lowStockProductsCount },
      { count: ordersCount },
      { count: pendingOrdersCount },
      { count: customersCount },
      { data: paidOrders },
      { data: recentOrders },
      { data: recentProducts },
    ] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("active", true),
      supabase.from("products").select("*", { count: "exact", head: true }).lt("stock_quantity", 5),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
      supabase.from("orders").select("total").eq("payment_status", "paid"),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false }).limit(5),
    ]);

    const totalRevenue = (paidOrders || []).reduce((acc, order) => acc + Number(order.total || 0), 0);
    return {
      productsCount: productsCount ?? 0,
      activeProductsCount: activeProductsCount ?? 0,
      lowStockProductsCount: lowStockProductsCount ?? 0,
      ordersCount: ordersCount ?? 0,
      pendingOrdersCount: pendingOrdersCount ?? 0,
      customersCount: customersCount ?? 0,
      totalRevenue,
      recentOrders: recentOrders || [],
      recentProducts: recentProducts || [],
    };
  } catch (e) {
    console.error("Error in getAdminStats:", e);
  }

  return {
    productsCount: 0,
    activeProductsCount: 0,
    lowStockProductsCount: 0,
    ordersCount: 0,
    pendingOrdersCount: 0,
    customersCount: 0,
    totalRevenue: 0.00,
    recentOrders: [],
    recentProducts: [],
  };
}

export async function getAllAdminProducts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name), product_images(*)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.error("Error in getAllAdminProducts:", e);
  }

  return [];
}

export async function getAllAdminOrders(statusFilter?: string) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.error("Error in getAllAdminOrders:", e);
  }

  return [];
}

export async function getAllAdminNews() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.error("Error in getAllAdminNews:", e);
  }

  return [];
}

export async function getAllAdminCategories() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.error("Error in getAllAdminCategories:", e);
  }

  return [];
}
