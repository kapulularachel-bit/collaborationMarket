import { useEffect, useState } from "react";
import { ChartBar as BarChart3, TrendingUp, Package, Star, DollarSign } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import type { Shop, Order, Review } from "../types";

export default function AnalyticsView() {
  const { profile } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const { data: shopData } = await supabase
        .from("shops")
        .select("*")
        .eq("seller_id", profile.id)
        .maybeSingle();
      const s = shopData as Shop | null;
      setShop(s);
      if (s) {
        const [ordersRes, reviewsRes] = await Promise.all([
          supabase.from("orders").select("*").eq("shop_id", s.id),
          supabase.from("reviews").select("*").eq("shop_id", s.id).order("created_at", { ascending: false }),
        ]);
        setOrders((ordersRes.data ?? []) as Order[]);
        setReviews((reviewsRes.data ?? []) as Review[]);
      }
      setLoading(false);
    })();
  }, [profile]);

  if (loading) return <div className="p-6 text-slate-400">Loading...</div>;

  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + Number(o.total), 0);
  const avgOrder = orders.length > 0 ? revenue / orders.length : 0;
  const completed = orders.filter((o) => o.status === "delivered").length;
  const cancelled = orders.filter((o) => o.status === "cancelled").length;
  const completionRate = orders.length > 0 ? (completed / orders.length) * 100 : 0;
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxCount = Math.max(...Object.values(statusCounts), 1);

  const stats = [
    { label: "Total Revenue", value: `KSh ${revenue.toLocaleString()}`, icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
    { label: "Avg Order Value", value: `KSh ${avgOrder.toFixed(0)}`, icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
    { label: "Completion Rate", value: `${completionRate.toFixed(0)}%`, icon: Package, color: "bg-purple-50 text-purple-600" },
    { label: "Avg Rating", value: `${avgRating.toFixed(1)}★`, icon: Star, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Analytics</h2>
        <p className="text-sm text-slate-500">Insights into your shop's performance</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-gula-600" />
            <h3 className="text-sm font-semibold text-slate-900">Orders by Status</h3>
          </div>
          {orders.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No order data yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="capitalize text-slate-600">{status.replace("_", " ")}</span>
                    <span className="font-semibold text-slate-900">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gula-500 transition-all"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Star size={18} className="text-gula-600" />
            <h3 className="text-sm font-semibold text-slate-900">Recent Reviews</h3>
          </div>
          {reviews.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No reviews yet</p>
          ) : (
            <div className="space-y-3">
              {reviews.slice(0, 5).map((r) => (
                <div key={r.id} className="border-b border-slate-50 pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">{r.buyer_name}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Order Summary</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-400">Total Orders</p>
            <p className="text-lg font-bold text-slate-900">{orders.length}</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3">
            <p className="text-xs text-emerald-600">Completed</p>
            <p className="text-lg font-bold text-emerald-700">{completed}</p>
          </div>
          <div className="rounded-lg bg-red-50 p-3">
            <p className="text-xs text-red-600">Cancelled</p>
            <p className="text-lg font-bold text-red-700">{cancelled}</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-xs text-blue-600">In Progress</p>
            <p className="text-lg font-bold text-blue-700">{orders.length - completed - cancelled}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
