import { useEffect, useState } from "react";
import { Package, ShoppingCart, DollarSign, TrendingUp, Star, Clock } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Shop, Product, Order, Review } from "../types";

export default function DashboardView({ shopId }: { shopId: string | null }) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shopId) return;
    Promise.all([
      supabase.from("shops").select("*").eq("id", shopId).single(),
      supabase.from("products").select("*").eq("shop_id", shopId).order("created_at", { ascending: false }),
      supabase.from("orders").select("*").eq("shop_id", shopId).order("created_at", { ascending: false }).limit(5),
      supabase.from("reviews").select("*").eq("shop_id", shopId).order("created_at", { ascending: false }).limit(5),
    ]).then(([s, p, o, r]) => {
      if (s.data) setShop(s.data as Shop);
      if (p.data) setProducts(p.data as Product[]);
      if (o.data) setOrders(o.data as Order[]);
      if (r.data) setReviews(r.data as Review[]);
      setLoading(false);
    });
  }, [shopId]);

  if (loading) return <div className="p-6 text-sm text-slate-400 dark:text-slate-500">Loading dashboard...</div>;

  const activeOrders = orders.filter((o) => !["delivered", "cancelled"].includes(o.status));
  const revenue = orders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.total, 0);
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40" },
    { label: "Active Orders", value: activeOrders.length, icon: ShoppingCart, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40" },
    { label: "Revenue (KSh)", value: revenue.toLocaleString(), icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    { label: "Avg Rating", value: avgRating, icon: Star, color: "text-gula-600 dark:text-gula-400", bg: "bg-gula-50 dark:bg-gula-950/40" },
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{shop?.name} · {shop?.university}</p>
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
            <Clock size={16} /> Recent Orders
          </h2>
          {orders.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">No orders yet</p>
          ) : (
            <div className="space-y-2">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-700">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{o.buyer_name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{o.items.length} item(s) · KSh {o.total}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(o.status)}`}>{o.status.replace(/_/g, " ")}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <TrendingUp size={16} /> Recent Reviews
          </h2>
          {reviews.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">No reviews yet</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="border-b border-slate-100 pb-3 last:border-0 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{r.buyer_name}</p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function statusColor(status: string) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
    preparing: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
    ready: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400",
    out_for_delivery: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400",
    delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  };
  return map[status] || "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
}
