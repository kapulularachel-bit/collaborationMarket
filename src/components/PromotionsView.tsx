import { useEffect, useState } from "react";
import { Tag, Plus, X, Trash2, Calendar } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import type { Shop, Promotion, PromotionType } from "../types";

export default function PromotionsView() {
  const { profile } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", type: "percentage" as PromotionType, value: "", ends_at: "" });

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
        const { data: promoData } = await supabase
          .from("promotions")
          .select("*")
          .eq("shop_id", s.id)
          .order("created_at", { ascending: false });
        setPromos((promoData ?? []) as Promotion[]);
      }
      setLoading(false);
    })();
  }, [profile]);

  const handleCreate = async () => {
    if (!shop) return;
    const ends = form.ends_at ? new Date(form.ends_at).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString();
    await supabase.from("promotions").insert({
      shop_id: shop.id,
      title: form.title,
      description: form.description,
      type: form.type,
      value: parseFloat(form.value) || 0,
      ends_at: ends,
    });
    setShowModal(false);
    setForm({ title: "", description: "", type: "percentage", value: "", ends_at: "" });
    const { data } = await supabase
      .from("promotions")
      .select("*")
      .eq("shop_id", shop.id)
      .order("created_at", { ascending: false });
    setPromos((data ?? []) as Promotion[]);
  };

  const toggleActive = async (p: Promotion) => {
    await supabase.from("promotions").update({ is_active: !p.is_active }).eq("id", p.id);
    setPromos(promos.map((pr) => (pr.id === p.id ? { ...pr, is_active: !pr.is_active } : pr)));
  };

  const handleDelete = async (id: string) => {
    await supabase.from("promotions").delete().eq("id", id);
    setPromos(promos.filter((p) => p.id !== id));
  };

  if (loading) return <div className="p-6 text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Promotions</h2>
          <p className="text-sm text-slate-500">Create deals to attract more customers</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-xl bg-gula-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gula-700">
          <Plus size={16} /> New Promotion
        </button>
      </div>

      {promos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Tag size={40} className="mx-auto mb-3 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-900">No promotions yet</h3>
          <p className="mt-1 text-sm text-slate-500">Create your first promotion to boost sales.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {promos.map((p) => (
            <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gula-50 text-gula-600">
                    <Tag size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{p.title}</h3>
                    <p className="text-xs text-slate-400 capitalize">{p.type} · {p.value}{p.type === "percentage" ? "%" : " KSh off"}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(p.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">{p.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar size={12} /> Ends {new Date(p.ends_at).toLocaleDateString()}
                </div>
                <button
                  onClick={() => toggleActive(p)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                    p.is_active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {p.is_active ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md animate-fade-in rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">New Promotion</h3>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20"
                  placeholder="Weekend Special" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as PromotionType })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-gula-500 focus:bg-white">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="bogo">Buy One Get One</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Value</label>
                  <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-gula-500 focus:bg-white"
                    placeholder="20" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">End Date</label>
                <input type="date" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-gula-500 focus:bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-gula-500 focus:bg-white" />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleCreate} disabled={!form.title || !form.value}
                className="flex-1 rounded-xl bg-gula-600 py-2.5 text-sm font-semibold text-white hover:bg-gula-700 disabled:opacity-50">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
