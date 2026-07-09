import { useEffect, useState } from "react";
import { ClipboardList, ChevronRight, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import type { Shop, Order, OrderStatus } from "../types";

const statusFlow: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"];

export default function OrdersView() {
  const { profile } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Order | null>(null);

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
        const { data: orderData } = await supabase
          .from("orders")
          .select("*")
          .eq("shop_id", s.id)
          .order("created_at", { ascending: false });
        setOrders((orderData ?? []) as Order[]);
      }
      setLoading(false);
    })();
  }, [profile]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
    if (selected?.id === orderId) setSelected({ ...selected, status });
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <div className="p-6 text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Orders</h2>
        <p className="text-sm text-slate-500">Manage and track customer orders</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
              filter === f ? "bg-gula-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <ClipboardList size={40} className="mx-auto mb-3 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-900">No orders found</h3>
          <p className="mt-1 text-sm text-slate-500">Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelected(order)}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3 transition hover:border-gula-300 hover:shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gula-50 text-sm font-bold text-gula-700">
                  {order.buyer_name?.charAt(0).toUpperCase() ?? "?"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{order.buyer_name || "Anonymous"}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(order.created_at).toLocaleString()} · {(order.items as unknown as unknown[])?.length ?? 0} items
                  </p>
                </div>
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
                <p className="text-sm font-bold text-slate-900">KSh {Number(order.total).toLocaleString()}</p>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg animate-fade-in rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Order Details</h3>
              <button onClick={() => setSelected(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Customer</span>
                <span className="text-sm font-medium text-slate-900">{selected.buyer_name || "Anonymous"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Date</span>
                <span className="text-sm font-medium text-slate-900">{new Date(selected.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Delivery Address</span>
                <span className="text-sm font-medium text-slate-900">{selected.delivery_address}</span>
              </div>
              {selected.notes && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Notes</span>
                  <span className="text-sm font-medium text-slate-900">{selected.notes}</span>
                </div>
              )}
              <div className="border-t border-slate-100 pt-3">
                <p className="mb-2 text-sm font-semibold text-slate-900">Items</p>
                <div className="space-y-1.5">
                  {(selected.items as unknown as Array<{product_name: string; quantity: number; price: number}>).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-600">{item.quantity}x {item.product_name}</span>
                      <span className="font-medium text-slate-900">KSh {(item.quantity * item.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3">
                <span className="text-sm font-bold text-slate-900">Total</span>
                <span className="text-sm font-bold text-slate-900">KSh {Number(selected.total).toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <p className="mb-2 text-sm font-semibold text-slate-900">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {statusFlow.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                        selected.status === s ? "bg-gula-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {s.replace("_", " ")}
                    </button>
                  ))}
                  <button
                    onClick={() => updateStatus(selected.id, "cancelled")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                      selected.status === "cancelled" ? "bg-red-600 text-white" : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
