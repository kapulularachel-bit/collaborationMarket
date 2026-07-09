import { useEffect, useState } from "react";
import { Wallet, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import type { Payout } from "../types";

export default function PayoutsView() {
  const { profile } = useAuth();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    supabase.from("payouts").select("*").eq("seller_id", profile.id).order("created_at", { ascending: false }).then(({ data }) => { setPayouts((data ?? []) as Payout[]); setLoading(false); });
  }, [profile]);

  if (loading) return <div className="p-6 text-slate-400 dark:text-slate-500">Loading...</div>;

  const totalPaid = payouts.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
  const pending = payouts.filter((p) => p.status === "pending" || p.status === "processing").reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div className="space-y-6 p-6">
      <div><h2 className="text-xl font-bold text-slate-900 dark:text-white">Payouts</h2><p className="text-sm text-slate-500 dark:text-slate-400">Track your earnings and payout history</p></div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"><CheckCircle size={20} /></div><p className="text-2xl font-bold text-slate-900 dark:text-white">KSh {totalPaid.toLocaleString()}</p><p className="text-xs text-slate-400 dark:text-slate-500">Total Paid Out</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"><Clock size={20} /></div><p className="text-2xl font-bold text-slate-900 dark:text-white">KSh {pending.toLocaleString()}</p><p className="text-xs text-slate-400 dark:text-slate-500">Pending Payouts</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"><TrendingUp size={20} /></div><p className="text-2xl font-bold text-slate-900 dark:text-white">KSh {(totalPaid + pending).toLocaleString()}</p><p className="text-xs text-slate-400 dark:text-slate-500">Total Earnings</p></div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700"><h3 className="text-sm font-semibold text-slate-900 dark:text-white">Payout History</h3></div>
        {payouts.length === 0 ? (
          <div className="px-5 py-12 text-center"><Wallet size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" /><p className="text-sm text-slate-400 dark:text-slate-500">No payouts yet</p><p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Your payout history will appear here.</p></div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {payouts.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-4">
                <div><p className="text-sm font-medium text-slate-900 dark:text-white">{p.period || "Payout"}</p><p className="text-xs text-slate-400 dark:text-slate-500">{new Date(p.created_at).toLocaleDateString()}</p></div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${p.status === "paid" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400" : p.status === "failed" ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400" : "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"}`}>{p.status}</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">KSh {Number(p.amount).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
