import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Star } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Order, Product, Review } from "../types";

export default function AnalyticsView({ shopId }: { shopId: string | null }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shopId) return;
    Promise.all([
      supabase.from("orders").select("*").eq("shop_id", shopId),
      supabase.from("products").select("*").eq("shop_id", shopId),
      supabase.from("reviews").select("*").eq("shop_id", shopId),
    ]).then(([o, p, r]) => {
      if (o.data) setOrders(o.data as Order[]);
      if (p.data) setProducts(p.data as Product[]);
      if (r.data) setReviews(r.data as Review[]);
      setLoading(false);
    });
  }, [shopId]);

  if (loading) return <div className="p-6 text-sm text-slate-400 dark:text-slate-500">Loading analytics...</div>;

  const delivered = orders.filter((o) => o.status === "delivered");
  const revenue = delivered.reduce((s, o) => s + o.total, 0);
  const avgOrder = delivered.length > 0 ? Math.round(revenue / delivered.length) : 0;
  const cancelled = orders.filter((o) => o.status === "cancelled");
  const cancelRate = orders.length > 0 ? ((cancelled.length / orders.length) * 100).toFixed(1) : "0";
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  const topProducts = products
    .map((p) => {
      const sold = orders
        .filter((o) => o.status === "delivered")
        .flatMap((o) => o.items)
        .filter((i) => i.product_id === p.id)
        .reduce((s, i) => s + i.quantity, 0);
      return { ...p, sold };
    })
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayOrders = orders.filter((o) => {
      const od = new Date(o.created_at);
      return od.toDateString() === date.toDateString() && o.status === "delivered";
    });
    return {
      label: date.toLocaleDateString("en", { weekday: "short" }),
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    };
  });

  const maxRev = Math.max(...last7Days.map((d) => d.revenue), 1);

  const stats = [
    { label: "Total Revenue", value: `KSh ${revenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    { label: "Avg Order Value", value: `KSh ${avgOrder.toLocaleString()}`, icon: ShoppingCart, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40" },
    { label: "Cancel Rate", value: `${cancelRate}%`, icon: TrendingDown, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/40" },
    { label: "Avg Rating", value: avgRating, icon: Star, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40" },
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track your shop performance</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                <Icon size={20} className={s.color} />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <TrendingUp size={16} /> Revenue (Last 7 Days)
          </h2>
          <div className="flex items-end justify-between gap-2" style={{ height: 200 }}>
            {last7Days.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-gula-500 transition-all hover:bg-gula-600"
                    style={{ height: `${(d.revenue / maxRev) * 100}%`, minHeight: d.revenue > 0 ? "8px" : "2px" }}
                    title={`KSh ${d.revenue}`}
                  />
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Package size={16} /> Top Products
          </h2>
          {topProducts.length === 0 || topProducts.every((p) => p.sold === 0) ? (
            <p className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">No sales data yet</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{p.sold} sold · KSh {p.price}</p>
                  </div>
                  <span className="text-sm font-bold text-gula-600 dark:text-gula-400">KSh {p.sold * p.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
