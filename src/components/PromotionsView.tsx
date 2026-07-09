import { useEffect, useState } from "react";
import { Plus, Trash2, X, Tag } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Promotion, PromotionType } from "../types";

export default function PromotionsView({ shopId }: { shopId: string | null }) {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<PromotionType>("percentage");
  const [value, setValue] = useState("");
  const [startsAt, setStartsAt] = useState(new Date().toISOString().slice(0, 10));
  const [endsAt, setEndsAt] = useState(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPromos = () => {
    if (!shopId) return;
    supabase.from("promotions").select("*").eq("shop_id", shopId).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setPromos(data as Promotion[]); setLoading(false); });
  };

  useEffect(() => { fetchPromos(); }, [shopId]);

  const handleSave = async () => {
    if (!shopId) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("promotions").insert({
      shop_id: shopId,
      title, description,
      type,
      value: parseFloat(value) || 0,
      starts_at: new Date(startsAt).toISOString(),
      ends_at: new Date(endsAt).toISOString(),
      is_active: true,
    });
    if (error) setError(error.message);
    else { setShowForm(false); fetchPromos(); setTitle(""); setDescription(""); setValue(""); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promotion?")) return;
    await supabase.from("promotions").delete().eq("id", id);
    fetchPromos();
  };

  const toggleActive = async (p: Promotion) => {
    await supabase.from("promotions").update({ is_active: !p.is_active }).eq("id", p.id);
    fetchPromos();
  };

  if (loading) return <div className="p-6 text-sm text-slate-400 dark:text-slate-500">Loading promotions...</div>;

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600";

  const isExpired = (p: Promotion) => new Date(p.ends_at) < new Date();

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Promotions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{promos.length} promotion(s)</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 rounded-xl bg-gula-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gula-700">
          <Plus size={16} /> New Promotion
        </button>
      </div>

      {promos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-600">
          <Tag size={32} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400 dark:text-slate-500">No promotions yet. Create one to attract more customers.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promos.map((p) => (
            <div key={p.id} className={`rounded-2xl border p-4 ${p.is_active && !isExpired(p) ? "border-gula-300 bg-gula-50 dark:border-gula-700 dark:bg-gula-950/30" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{p.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{p.description}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.is_active && !isExpired(p) ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"}`}>
                  {isExpired(p) ? "Expired" : p.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-lg bg-gula-600 px-2 py-1 text-xs font-bold text-white">
                  {p.type === "percentage" ? `${p.value}% OFF` : p.type === "fixed" ? `KSh ${p.value} OFF` : "BOGO"}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {new Date(p.starts_at).toLocaleDateString()} - {new Date(p.ends_at).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => toggleActive(p)} className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                  {p.is_active ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => handleDelete(p.id)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">New Promotion</h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="Weekend Special" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value as PromotionType)} className={inputCls}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="bogo">Buy One Get One</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Value</label>
                  <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className={inputCls} placeholder="20" disabled={type === "bogo"} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Starts</label>
                  <input type="date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Ends</label>
                  <input type="date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className={inputCls} />
                </div>
              </div>
              {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-400">{error}</div>}
              <button onClick={handleSave} disabled={saving || !title} className="w-full rounded-xl bg-gula-600 py-2.5 text-sm font-semibold text-white hover:bg-gula-700 disabled:opacity-50">
                {saving ? "Creating..." : "Create Promotion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
