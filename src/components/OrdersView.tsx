import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Order, OrderStatus } from "../types";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"];

export default function OrdersView({ shopId }: { shopId: string | null }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const fetchOrders = () => {
    if (!shopId) return;
    supabase.from("orders").select("*").eq("shop_id", shopId).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setOrders(data as Order[]); setLoading(false); });
  };

  useEffect(() => { fetchOrders(); }, [shopId]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    setSelected((s) => s && s.id === id ? { ...s, status } : s);
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <div className="p-6 text-sm text-slate-400 dark:text-slate-500">Loading orders...</div>;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Orders</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{orders.length} total order(s)</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter("all")} className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${filter === "all" ? "bg-gula-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"}`}>All</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${filter === s ? "bg-gula-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"}`}>
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-600">
          <p className="text-sm text-slate-400 dark:text-slate-500">No orders in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <div key={o.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{o.buyer_name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(o.status)}`}>{o.status.replace(/_/g, " ")}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {o.items.length} item(s) · KSh {o.total} · {new Date(o.created_at).toLocaleDateString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Deliver to: {o.delivery_address}</p>
                  {o.notes && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Note: {o.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelected(o)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Details</button>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Order Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Buyer</p>
                <p className="text-sm text-slate-900 dark:text-white">{selected.buyer_name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Delivery Address</p>
                <p className="text-sm text-slate-900 dark:text-white">{selected.delivery_address}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Items</p>
                <div className="space-y-1">
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-slate-700 dark:text-slate-300">
                      <span>{item.quantity}x {item.product_name}</span>
                      <span>KSh {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-slate-200 pt-2 dark:border-slate-700">
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span>Total</span><span>KSh {selected.total}</span>
                </div>
              </div>
              {selected.notes && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Notes</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{selected.notes}</p>
                </div>
              )}
            </div>
            <button onClick={() => setSelected(null)} className="mt-4 w-full rounded-xl bg-gula-600 py-2.5 text-sm font-semibold text-white hover:bg-gula-700">Close</button>
          </div>
        </div>
      )}
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
