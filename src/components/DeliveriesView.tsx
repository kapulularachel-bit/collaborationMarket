import { useEffect, useState } from "react";
import { Truck, MapPin, Clock, CircleCheck as CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import type { Shop, Delivery, DeliveryStatus } from "../types";

const statusOrder: DeliveryStatus[] = ["assigned", "picked_up", "in_transit", "delivered", "failed"];

export default function DeliveriesView() {
  const { profile } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
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
        const { data: orderData } = await supabase
          .from("orders")
          .select("id, buyer_name, delivery_address, created_at")
          .eq("shop_id", s.id)
          .order("created_at", { ascending: false });
        const orders = orderData ?? [];
        if (orders.length > 0) {
          const { data: delData } = await supabase
            .from("deliveries")
            .select("*")
            .in("order_id", orders.map((o: { id: string }) => o.id))
            .order("created_at", { ascending: false });
          const mapped = ((delData ?? []) as Delivery[]).map((d) => {
            const order = orders.find((o: { id: string }) => o.id === d.order_id) as { buyer_name: string; delivery_address: string } | undefined;
            return {
              ...d,
              buyer_name: d.buyer_name || order?.buyer_name || "",
              delivery_address: d.delivery_address || order?.delivery_address || "",
            };
          });
          setDeliveries(mapped);
        }
      }
      setLoading(false);
    })();
  }, [profile]);

  const updateStatus = async (id: string, status: DeliveryStatus) => {
    const updates: Partial<Delivery> = { status };
    if (status === "picked_up") updates.picked_up_at = new Date().toISOString();
    if (status === "delivered") updates.delivered_at = new Date().toISOString();
    await supabase.from("deliveries").update(updates).eq("id", id);
    setDeliveries(deliveries.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  if (loading) return <div className="p-6 text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Deliveries</h2>
        <p className="text-sm text-slate-500">Track and manage order deliveries</p>
      </div>

      {deliveries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Truck size={40} className="mx-auto mb-3 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-900">No deliveries yet</h3>
          <p className="mt-1 text-sm text-slate-500">Deliveries will appear here once orders are ready for dispatch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {deliveries.map((d) => (
            <div key={d.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Truck size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{d.buyer_name || "Customer"}</p>
                    <p className="text-xs text-slate-400">Order #{d.order_number || d.order_id.slice(0, 8)}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                  d.status === "delivered" ? "bg-emerald-50 text-emerald-600" :
                  d.status === "failed" ? "bg-red-50 text-red-600" :
                  d.status === "in_transit" ? "bg-blue-50 text-blue-600" :
                  "bg-amber-50 text-amber-600"
                }`}>
                  {d.status.replace("_", " ")}
                </span>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={14} className="mt-0.5 text-slate-400" />
                  <span className="text-slate-600">{d.delivery_address || "No address"}</span>
                </div>
                {d.driver_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <Truck size={14} className="text-slate-400" />
                    <span className="text-slate-600">Driver: {d.driver_name}</span>
                  </div>
                )}
                {d.picked_up_at && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={12} /> Picked up: {new Date(d.picked_up_at).toLocaleTimeString()}
                  </div>
                )}
                {d.delivered_at && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600">
                    <CheckCircle size={12} /> Delivered: {new Date(d.delivered_at).toLocaleTimeString()}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {statusOrder.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(d.id, s)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition ${
                      d.status === s
                        ? s === "failed" ? "bg-red-600 text-white" : "bg-gula-600 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
