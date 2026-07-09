import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";

const UNIVERSITIES = [
  "University of Nairobi",
  "Kenyatta University",
  "Strathmore University",
  "JKUAT",
  "USIU-Africa",
  "Daystar University",
  "Catholic University of Eastern Africa",
];

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const { profile, refreshProfile } = useAuth();
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [university, setUniversity] = useState(UNIVERSITIES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setError(null);
    setLoading(true);

    const { data: shop, error: shopErr } = await supabase
      .from("shops")
      .insert({
        seller_id: profile.id,
        name: shopName,
        description,
        category,
        university,
        rating: 0,
        total_sales: 0,
        is_active: true,
      })
      .select()
      .single();

    if (shopErr) {
      setError(shopErr.message);
      setLoading(false);
      return;
    }

    if (profile.university !== university) {
      await supabase.from("profiles").update({ university }).eq("id", profile.id);
    }

    await refreshProfile();
    setLoading(false);
    onDone();
  };

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gula-50 via-slate-50 to-emerald-50 px-4 dark:from-gula-950 dark:via-slate-950 dark:to-emerald-950">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Set up your shop</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tell customers what you sell and where you operate.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Shop Name</label>
            <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} required className={inputCls} placeholder="Brenda's Kitchen" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} placeholder="Home-cooked meals delivered fresh to your hostel." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                <option>Food</option>
                <option>Drinks</option>
                <option>Snacks</option>
                <option>Stationery</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">University</label>
              <select value={university} onChange={(e) => setUniversity(e.target.value)} className={inputCls}>
                {UNIVERSITIES.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-400">{error}</div>}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-gula-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gula-700 disabled:opacity-50">
            {loading ? "Creating shop..." : "Create Shop"}
          </button>
        </form>
      </div>
    </div>
  );
}
