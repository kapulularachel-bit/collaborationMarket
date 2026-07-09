import { useEffect, useState } from "react";
import { Truck, MapPin, CircleCheck as CheckCircle, Clock, Circle as XCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Delivery, DeliveryStatus } from "../types";

const STATUSES: DeliveryStatus[] = ["assigned", "picked_up", "in_transit", "delivered", "failed"];

export default function DeliveriesView({ shopId }: { shopId: string | null }) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shopId) return;
    supabase.from("deliveries").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setDeliveries(data as Delivery[]); setLoading(false); });
  }, [shopId]);

  const updateStatus = async (id: string, status: DeliveryStatus) => {
    await supabase.from("deliveries").update({ status }).eq("id", id);
    setDeliveries((prev) => prev.map((d) => d.id === id ? { ...d, status } : d));
  };

  if (loading) return <div className="p-6 text-sm text-slate-400 dark:text-slate-500">Loading deliveries...</div>;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Deliveries</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{deliveries.length} delivery record(s)</p>
      </div>

      {deliveries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-600">
          <Truck size={32} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400 dark:text-slate-500">No deliveries yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {deliveries.map((d) => (
            <div key={d.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${statusIcon(d.status).bg}`}>
                    {statusIcon(d.status).icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Order #{d.order_number}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{d.buyer_name}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(d.status)}`}>{d.status.replace(/_/g, " ")}</span>
              </div>
              <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <p className="flex items-center gap-1.5"><MapPin size={12} /> {d.delivery_address}</p>
                {d.driver_name && <p>Driver: {d.driver_name}</p>}
                {d.picked_up_at && <p>Picked up: {new Date(d.picked_up_at).toLocaleString()}</p>}
                {d.delivered_at && <p>Delivered: {new Date(d.delivered_at).toLocaleString()}</p>}
              </div>
              <div className="mt-3">
                <select
                  value={d.status}
                  onChange={(e) => updateStatus(d.id, e.target.value as DeliveryStatus)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function statusColor(status: string) {
  const map: Record<string, string> = {
    assigned: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    picked_up: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
    in_transit: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400",
    delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  };
  return map[status] || "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
}

function statusIcon(status: string) {
  const map: Record<string, { icon: React.ReactNode; bg: string }> = {
    assigned: { icon: <Clock size={16} className="text-amber-600" />, bg: "bg-amber-50 dark:bg-amber-950/40" },
    picked_up: { icon: <Truck size={16} className="text-blue-600" />, bg: "bg-blue-50 dark:bg-blue-950/40" },
    in_transit: { icon: <Truck size={16} className="text-indigo-600" />, bg: "bg-indigo-50 dark:bg-indigo-950/40" },
    delivered: { icon: <CheckCircle size={16} className="text-emerald-600" />, bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    failed: { icon: <XCircle size={16} className="text-red-600" />, bg: "bg-red-50 dark:bg-red-950/40" },
  };
  return map[status] || map.assigned;
}
