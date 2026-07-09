import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Package, ClipboardList, Wallet, Star, Users } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import type { Shop, Order } from "../types";

export default function DashboardView() {
  const { profile } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [orders, setOrders] = useState<Order[]>(null as unknown as Order[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const { data: shopData } = await supabase
        .from("shops")
        .select("*")
        .eq("seller_id", profile.id)
        .maybeSingle();
      setShop(shopData as Shop | null);

      if (shopData) {
        const { data: orderData } = await supabase
          .from("orders")
          .select("*")
          .eq("shop_id", shopData.id)
          .order("created_at", { ascending: false })
          .limit(5);
        setOrders((orderData ?? []) as Order[]);
      } else {
        setOrders([]);
      }
      setLoading(false);
    })();
  }, [profile]);

  if (loading) return <div className="p-6 text-slate-400">Loading...</div>;

  const totalRevenue = (orders ?? []).reduce((sum, o) => o.status !== "cancelled" ? sum + Number(o.total) : sum, 0);
  const pendingOrders = (orders ?? []).filter((o) => o.status === "pending").length;
  const completedOrders = (orders ?? []).filter((o) => o.status === "delivered").length;

  const stats = [
    { label: "Total Revenue", value: `KSh ${totalRevenue.toLocaleString()}`, icon: Wallet, trend: "+12.5%", up: true, color: "bg-emerald-50 text-emerald-600" },
    { label: "Total Orders", value: String(orders?.length ?? 0), icon: ClipboardList, trend: "+8.2%", up: true, color: "bg-blue-50 text-blue-600" },
    { label: "Pending", value: String(pendingOrders), icon: Package, trend: pendingOrders > 0 ? "Needs attention" : "All caught up", up: pendingOrders === 0, color: "bg-amber-50 text-amber-600" },
    { label: "Shop Rating", value: shop ? `${shop.rating}★` : "—", icon: Star, trend: "Based on reviews", up: true, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Welcome back, {profile?.full_name.split(" ")[0]}!</h2>
        <p className="text-sm text-slate-500">Here's what's happening with your shop today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-emerald-600" : "text-amber-600"}`}>
                  {stat.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {stat.trend}
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-slate-900">Recent Orders</h3>
              <span className="text-xs text-slate-400">{orders?.length ?? 0} total</span>
            </div>
            <div className="divide-y divide-slate-50">
              {(!orders || orders.length === 0) ? (
                <p className="px-5 py-10 text-center text-sm text-slate-400">No orders yet</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{order.buyer_name || "Anonymous"}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(order.created_at).toLocaleDateString()} · {(order.items as unknown as Array<{quantity: number}>[])?.length ?? 0} items
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        order.status === "delivered" ? "bg-emerald-50 text-emerald-600" :
                        order.status === "pending" ? "bg-amber-50 text-amber-600" :
                        order.status === "cancelled" ? "bg-red-50 text-red-600" :
                        "bg-blue-50 text-blue-600"
                      }`}>
                        {order.status.replace("_", " ")}
                      </span>
                      <p className="text-sm font-semibold text-slate-900">KSh {Number(order.total).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Users size={18} className="text-gula-600" />
              <h3 className="text-sm font-semibold text-slate-900">Quick Stats</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-xs text-slate-500">Completed Orders</span>
                <span className="text-sm font-bold text-slate-900">{completedOrders}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-xs text-slate-500">Total Sales</span>
                <span className="text-sm font-bold text-slate-900">{shop?.total_sales ?? 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-xs text-slate-500">Shop Status</span>
                <span className={`text-sm font-bold ${shop?.is_active ? "text-emerald-600" : "text-slate-400"}`}>
                  {shop?.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-xs text-slate-500">University</span>
                <span className="text-sm font-bold text-slate-900">{shop?.university || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
