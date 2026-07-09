import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import type { Shop } from "../types";

export default function ShopView({ shopId }: { shopId: string | null }) {
  const { profile } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shopId) return;
    supabase.from("shops").select("*").eq("id", shopId).single().then(({ data, error }) => {
      if (error || !data) { setLoading(false); return; }
      setShop(data as Shop);
      setName(data.name);
      setDescription(data.description);
      setCategory(data.category);
      setIsActive(data.is_active);
      setLoading(false);
    });
  }, [shopId]);

  const handleSave = async () => {
    if (!shopId) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("shops").update({
      name, description, category, is_active: isActive,
    }).eq("id", shopId);
    if (error) setError(error.message);
    else {
      setShop((s) => s ? { ...s, name, description, category, is_active: isActive } : s);
      setEditing(false);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-6 text-sm text-slate-400 dark:text-slate-500">Loading shop...</div>;
  if (!shop) return <div className="p-6 text-sm text-slate-400 dark:text-slate-500">Shop not found.</div>;

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600";

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">My Shop</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your shop profile and settings</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="rounded-xl bg-gula-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gula-700">Edit</button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="h-32 bg-gradient-to-r from-gula-500 to-emerald-500" />
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gula-600 text-2xl font-bold text-white dark:border-slate-800">
              {shop.name[0]}
            </div>
            <div className="pb-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{shop.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{shop.university}</p>
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Shop Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                  <option>Food</option><option>Drinks</option><option>Snacks</option>
                  <option>Stationery</option><option>Electronics</option><option>Fashion</option><option>Other</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded accent-gula-600" />
                Shop is active (visible to buyers)
              </label>
              {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-400">{error}</div>}
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving} className="rounded-xl bg-gula-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gula-700 disabled:opacity-50">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button onClick={() => setEditing(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-300">{shop.description || "No description yet."}</p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">{shop.category}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${shop.is_active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"}`}>
                  {shop.is_active ? "Active" : "Inactive"}
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">{shop.rating} ★</span>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">{shop.total_sales} sales</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
