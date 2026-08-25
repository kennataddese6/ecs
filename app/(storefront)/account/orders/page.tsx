import { requireUser } from "@/lib/auth";
import { getUserOrders } from "@/lib/services/orders";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shop/price-display";
import { EmptyState } from "@/components/common/empty-state";
import { ChevronRight } from "lucide-react";

export default async function AccountOrdersPage() {
  await requireUser();
  const orders = await getUserOrders();

  if (orders.length === 0) {
    return (
      <div className="py-8">
        <EmptyState
          title="No orders placed yet"
          description="When you make a purchase, your order status and items will appear here."
          actionText="Start Shopping"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Your Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review details and tracking for your recent purchases.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const date = new Date(order.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <div
              key={order.id}
              className="border border-border bg-card p-6 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-base">{order.order_number}</span>
                  <Badge variant="secondary" className="capitalize">
                    {order.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Placed on {date} &bull; {order.order_items?.length || 0} item(s)
                </p>
              </div>

              <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                <PriceDisplay price={order.total} className="text-lg" />
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/account/orders/${order.id}`}>
                    Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
