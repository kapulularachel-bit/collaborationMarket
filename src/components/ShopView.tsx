import { useEffect, useState } from "react";
import { Store, Save } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import type { Shop } from "../types";

export default function ShopView() {
  const { profile } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "Food", university: "", logo_url: "", banner_url: "" });

  useEffect(() => {
    if (!profile) return;
    supabase
      .from("shops")
      .select("*")
      .eq("seller_id", profile.id)
      .maybeSingle()
      .then(({ data }) => {
        const s = data as Shop | null;
        setShop(s);
        if (s) {
          setForm({
            name: s.name,
            description: s.description,
            category: s.category,
            university: s.university,
            logo_url: s.logo_url ?? "",
            banner_url: s.banner_url ?? "",
          });
        }
        setLoading(false);
      });
  }, [profile]);

  const handleSave = async () => {
    if (!shop) return;
    setSaving(true);
    setSaved(false);
    await supabase
      .from("shops")
      .update({
        name: form.name,
        description: form.description,
        category: form.category,
        university: form.university,
        logo_url: form.logo_url || null,
        banner_url: form.banner_url || null,
      })
      .eq("id", shop.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="p-6 text-slate-400 dark:text-slate-500">Loading...</div>;

  if (!shop) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-600 dark:bg-slate-800">
          <Store size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No shop yet</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Complete onboarding to create your shop.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Shop</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your storefront details.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="h-32 bg-gradient-to-r from-gula-500 to-emerald-600" />
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gula-100 text-2xl font-bold text-gula-700 dark:border-slate-800 dark:bg-gula-900 dark:text-gula-300">
              {form.name.charAt(0).toUpperCase() || "S"}
            </div>
            <div className="pb-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{form.name || "Unnamed Shop"}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{form.category} · {form.university}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Shop Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600">
                <option>Food</option><option>Snacks</option><option>Drinks</option><option>Stationery</option><option>Electronics</option><option>Fashion</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">University</label>
              <input type="text" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Logo URL (optional)</label>
              <input type="text" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600" />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-gula-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gula-700 disabled:opacity-50">
              {saving ? "Saving..." : <><Save size={16} /> Save Changes</>}
            </button>
            {saved && <span className="text-sm text-emerald-600 dark:text-emerald-400">Saved!</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
