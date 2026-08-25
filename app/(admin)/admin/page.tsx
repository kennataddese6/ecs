import { requireAdmin } from "@/lib/auth";
import { getAdminStats } from "@/lib/services/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, ShoppingBag, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";
import { PriceDisplay } from "@/components/shop/price-display";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const {
    productsCount,
    activeProductsCount,
    lowStockProductsCount,
    ordersCount,
    pendingOrdersCount,
    totalRevenue,
    recentOrders,
    recentProducts,
  } = await getAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Admin Operations Center</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time analytics, inventory monitoring, and store fulfillment.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              <PriceDisplay price={totalRevenue} />
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500 mr-1 inline" />
              Verified paid transactions
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">{ordersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-bold text-amber-500">{pendingOrdersCount}</span> pending fulfillment
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Catalog Items</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">{productsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-bold text-emerald-500">{activeProductsCount}</span> published online
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Low Stock Warning</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">{lowStockProductsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Products with &lt; 5 stock units
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Recent Customer Orders</CardTitle>
              <CardDescription>Latest orders submitted by clients</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No recent orders recorded.</p>
            ) : (
              <div className="divide-y border-t border-border">
                {recentOrders.map((order) => (
                  <div key={order.id} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-bold">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_name}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="capitalize text-xs">{order.status}</Badge>
                      <PriceDisplay price={order.total} className="font-semibold" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">New Catalog Items</CardTitle>
              <CardDescription>Recently added inventory products</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/products">Manage Catalog</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No products in catalog.</p>
            ) : (
              <div className="divide-y border-t border-border">
                {recentProducts.map((prod) => (
                  <div key={prod.id} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-bold line-clamp-1">{prod.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {prod.sku || "N/A"}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={prod.stock_quantity < 5 ? "text-amber-500 font-bold text-xs" : "text-xs font-medium"}>
                        {prod.stock_quantity} in stock
                      </span>
                      <PriceDisplay price={prod.price} className="font-semibold" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
