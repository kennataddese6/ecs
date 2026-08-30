import { createClient } from "@/lib/supabase/server";

const DEMO_ADMIN_PRODUCTS = [
  {
    id: "prod-1",
    name: "Yirgacheffe Grade-1 Organic Roasted Coffee Beans (1kg)",
    slug: "yirgacheffe-grade-1-coffee-beans",
    price: 28.50,
    compare_at_price: 34.00,
    stock_quantity: 45,
    sku: "ETH-COF-001",
    unit_label: "1 kg",
    featured: true,
    active: true,
    categories: { name: "Ethiopian Coffee & Buna" },
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Royal Handwoven Habesha Kemis with Gold Border",
    slug: "royal-handwoven-habesha-kemis",
    price: 145.00,
    compare_at_price: 185.00,
    stock_quantity: 12,
    sku: "ETH-CLO-001",
    unit_label: "1 Item",
    featured: true,
    active: true,
    categories: { name: "Traditional Habesha Apparel" },
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Traditional Spiced Clarified Butter (Niter Kibe - 500g)",
    slug: "traditional-spiced-clarified-butter-niter-kibe",
    price: 19.50,
    compare_at_price: 24.00,
    stock_quantity: 30,
    sku: "ETH-SPC-001",
    unit_label: "500 g",
    featured: true,
    active: true,
    categories: { name: "Spices & Niter Kibe" },
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "Sidama Specialty Grade Whole Coffee Beans (1kg)",
    slug: "sidama-specialty-whole-coffee-beans",
    price: 26.00,
    compare_at_price: 32.00,
    stock_quantity: 40,
    sku: "ETH-COF-002",
    unit_label: "1 kg",
    featured: true,
    active: true,
    categories: { name: "Ethiopian Coffee & Buna" },
    created_at: new Date().toISOString(),
  },
];

const DEMO_ADMIN_ORDERS: Record<string, unknown>[] = [];

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

    if (productsCount || ordersCount) {
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
    }
  } catch (e) {}

  return {
    productsCount: DEMO_ADMIN_PRODUCTS.length,
    activeProductsCount: DEMO_ADMIN_PRODUCTS.length,
    lowStockProductsCount: 0,
    ordersCount: 0,
    pendingOrdersCount: 0,
    customersCount: 0,
    totalRevenue: 0.00,
    recentOrders: DEMO_ADMIN_ORDERS,
    recentProducts: DEMO_ADMIN_PRODUCTS,
  };
}

export async function getAllAdminProducts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name), product_images(*)")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {}

  return DEMO_ADMIN_PRODUCTS;
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
  } catch (e) {}

  return DEMO_ADMIN_ORDERS;
}

export async function getAllAdminNews() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {}

  return [
    {
      id: "news-1",
      title: "The Timeless Ritual of the Ethiopian Coffee Ceremony (Buna)",
      slug: "art-of-acoustic-engineering",
      published: true,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: "news-2",
      title: "Preserving Handwoven Habesha Textiles: The Art of Shemma Craft",
      slug: "florentine-leathercraft-sustainable-tanning",
      published: true,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
  ];
}

export async function getAllAdminCategories() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {}

  return [
    { id: "c1000000-0000-0000-0000-000000000001", name: "Ethiopian Coffee & Buna", slug: "coffee", description: "Coffee & Buna accessories", image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop", active: true },
    { id: "c2000000-0000-0000-0000-000000000002", name: "Traditional Habesha Apparel", slug: "apparel", description: "Habesha Kemis", image_url: "/habesha-cloth.png", active: true },
    { id: "c3000000-0000-0000-0000-000000000003", name: "Spices & Niter Kibe", slug: "spices", description: "Berbere & Niter Kibe", image_url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=800&auto=format&fit=crop", active: true },
    { id: "c4000000-0000-0000-0000-000000000004", name: "Artisan Mesob & Crafts", slug: "crafts", description: "Mesob baskets", image_url: "https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=800&auto=format&fit=crop", active: true },
  ];
}
