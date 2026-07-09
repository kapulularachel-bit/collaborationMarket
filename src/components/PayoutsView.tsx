import { useEffect, useState } from "react";
import { Wallet, Plus, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import type { Payout, PayoutStatus } from "../types";

export default function PayoutsView({ shopId }: { shopId: string | null }) {
  const { profile } = useAuth();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayouts = () => {
    if (!profile) return;
    supabase.from("payouts").select("*").eq("seller_id", profile.id).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setPayouts(data as Payout[]); setLoading(false); });
  };

  useEffect(() => { fetchPayouts(); }, [profile]);

  const handleRequest = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("payouts").insert({
      seller_id: profile.id,
      amount: parseFloat(amount) || 0,
      status: "pending",
      period,
    });
    if (error) setError(error.message);
    else { setShowForm(false); fetchPayouts(); setAmount(""); }
    setSaving(false);
  };

  if (loading) return <div className="p-6 text-sm text-slate-400 dark:text-slate-500">Loading payouts...</div>;

  const totalPaid = payouts.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pending = payouts.filter((p) => p.status === "pending" || p.status === "processing").reduce((s, p) => s + p.amount, 0);

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600";

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Payouts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your earnings</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 rounded-xl bg-gula-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gula-700">
          <Plus size={16} /> Request Payout
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
            <Wallet size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">KSh {totalPaid.toLocaleString()}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Paid Out</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40">
            <Wallet size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">KSh {pending.toLocaleString()}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
        </div>
      </div>

      {payouts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-600">
          <Wallet size={32} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400 dark:text-slate-500">No payout requests yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Period</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0 dark:border-slate-700">
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{p.period}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">KSh {p.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${payoutStatusColor(p.status)}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Request Payout</h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Amount (KSh)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} placeholder="5000" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Period</label>
                <input type="month" value={period} onChange={(e) => setPeriod(e.target.value)} className={inputCls} />
              </div>
              {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-400">{error}</div>}
              <button onClick={handleRequest} disabled={saving || !amount} className="w-full rounded-xl bg-gula-600 py-2.5 text-sm font-semibold text-white hover:bg-gula-700 disabled:opacity-50">
                {saving ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function payoutStatusColor(status: PayoutStatus) {
  const map: Record<PayoutStatus, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    processing: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
    paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  };
  return map[status];
}
