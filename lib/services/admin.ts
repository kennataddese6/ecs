import { createClient } from "@/lib/supabase/server";

const DEMO_ADMIN_PRODUCTS = [
  {
    id: "prod-1",
    name: "LUMEN Studio Master Wireless Headphones",
    slug: "lumen-studio-master-wireless-headphones",
    price: 349.00,
    compare_at_price: 420.00,
    stock_quantity: 15,
    sku: "AUD-001",
    featured: true,
    active: true,
    categories: { name: "Premium Audio" },
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Tuscan Grain Leather Tote",
    slug: "tuscan-grain-leather-tote",
    price: 280.00,
    compare_at_price: 320.00,
    stock_quantity: 8,
    sku: "ACC-001",
    featured: true,
    active: true,
    categories: { name: "Artisan Accessories" },
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Chronos Titanium Automatic Watch",
    slug: "chronos-titanium-automatic-watch",
    price: 890.00,
    compare_at_price: 990.00,
    stock_quantity: 4,
    sku: "ACC-002",
    featured: true,
    active: true,
    categories: { name: "Artisan Accessories" },
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "Minimalist Wool Cashmere Overcoat",
    slug: "minimalist-wool-cashmere-overcoat",
    price: 450.00,
    compare_at_price: 550.00,
    stock_quantity: 12,
    sku: "APP-001",
    featured: true,
    active: true,
    categories: { name: "Luxury Apparel" },
    created_at: new Date().toISOString(),
  },
];

const DEMO_ADMIN_ORDERS = [
  {
    id: "ord-1001",
    order_number: "LMN-84920",
    customer_email: "alexander.wright@example.com",
    shipping_name: "Alexander Wright",
    status: "processing",
    payment_status: "paid",
    total: 349.00,
    created_at: new Date().toISOString(),
    order_items: [{ id: "item-1", product_name: "LUMEN Studio Master Wireless Headphones", unit_price: 349.00, quantity: 1 }],
  },
  {
    id: "ord-1002",
    order_number: "LMN-84921",
    customer_email: "elena.rodriguez@example.com",
    shipping_name: "Elena Rodriguez",
    status: "shipped",
    payment_status: "paid",
    total: 890.00,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    order_items: [{ id: "item-2", product_name: "Chronos Titanium Automatic Watch", unit_price: 890.00, quantity: 1 }],
  },
];

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
    productsCount: 4,
    activeProductsCount: 4,
    lowStockProductsCount: 1,
    ordersCount: 2,
    pendingOrdersCount: 0,
    customersCount: 12,
    totalRevenue: 1239.00,
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
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {}

  if (statusFilter && statusFilter !== "all") {
    return DEMO_ADMIN_ORDERS.filter((o) => o.status === statusFilter);
  }
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
      title: "The Art of Acoustic Engineering: Inside the Studio Master",
      slug: "art-of-acoustic-engineering",
      published: true,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: "news-2",
      title: "Florentine Leathercraft: Sustainable Tanning Techniques",
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
    { id: "cat-1", name: "Premium Audio", slug: "audio", description: "Audio gear", active: true },
    { id: "cat-2", name: "Luxury Apparel", slug: "apparel", description: "Tailored outerwear", active: true },
    { id: "cat-3", name: "Artisan Accessories", slug: "accessories", description: "Leather goods", active: true },
    { id: "cat-4", name: "Home & Living", slug: "home", description: "Modern living", active: true },
  ];
}
