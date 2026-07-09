import { useEffect, useState } from "react";
import { Shield, Store, Package, ClipboardList, Users, ImagePlus, Plus, X, Trash2, LayoutDashboard } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Shop, Product, Order, Billboard, Profile } from "../types";

type AdminTab = "overview" | "billboards" | "shops" | "products" | "orders" | "users";

export default function AdminPortalView() {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBillboardModal, setShowBillboardModal] = useState(false);
  const [bbForm, setBbForm] = useState({ title: "", image_url: "", link_url: "", position: "0" });

  useEffect(() => {
    (async () => {
      const [shopsRes, productsRes, ordersRes, billboardsRes, usersRes] = await Promise.all([
        supabase.from("shops").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("*").order("created_at", { ascending: false }).limit(20),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(20),
        supabase.from("billboards").select("*").order("position", { ascending: true }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      ]);
      setShops((shopsRes.data ?? []) as Shop[]);
      setProducts((productsRes.data ?? []) as Product[]);
      setOrders((ordersRes.data ?? []) as Order[]);
      setBillboards((billboardsRes.data ?? []) as Billboard[]);
      setUsers((usersRes.data ?? []) as Profile[]);
      setLoading(false);
    })();
  }, []);

  const createBillboard = async () => {
    await supabase.from("billboards").insert({ title: bbForm.title, image_url: bbForm.image_url, link_url: bbForm.link_url || null, position: parseInt(bbForm.position) || 0 });
    setShowBillboardModal(false);
    setBbForm({ title: "", image_url: "", link_url: "", position: "0" });
    const { data } = await supabase.from("billboards").select("*").order("position", { ascending: true });
    setBillboards((data ?? []) as Billboard[]);
  };

  const deleteBillboard = async (id: string) => { await supabase.from("billboards").delete().eq("id", id); setBillboards(billboards.filter((b) => b.id !== id)); };
  const toggleBillboard = async (b: Billboard) => { await supabase.from("billboards").update({ is_active: !b.is_active }).eq("id", b.id); setBillboards(billboards.map((bb) => (bb.id === b.id ? { ...bb, is_active: !bb.is_active } : bb))); };

  if (loading) return <div className="p-6 text-slate-400 dark:text-slate-500">Loading...</div>;

  const tabs: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard }, { id: "billboards", label: "Billboards", icon: ImagePlus },
    { id: "shops", label: "Shops", icon: Store }, { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ClipboardList }, { id: "users", label: "Users", icon: Users },
  ];

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600";

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2"><Shield size={22} className="text-gula-600 dark:text-gula-400" /><div><h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Portal</h2><p className="text-sm text-slate-500 dark:text-slate-400">Manage the GULA Marketplace platform</p></div></div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => { const Icon = t.icon; return (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${tab === t.id ? "bg-gula-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"}`}><Icon size={14} /> {t.label}</button>
        ); })}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Shops", value: shops.length, icon: Store, color: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400" },
            { label: "Total Products", value: products.length, icon: Package, color: "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400" },
            { label: "Total Orders", value: orders.length, icon: ClipboardList, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400" },
            { label: "Total Users", value: users.length, icon: Users, color: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400" },
          ].map((s) => { const Icon = s.icon; return (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"><div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}><Icon size={20} /></div><p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p><p className="text-xs text-slate-400 dark:text-slate-500">{s.label}</p></div>
          ); })}
        </div>
      )}

      {tab === "billboards" && (
        <div>
          <div className="mb-4 flex justify-end"><button onClick={() => setShowBillboardModal(true)} className="flex items-center gap-2 rounded-xl bg-gula-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gula-700"><Plus size={16} /> Add Billboard</button></div>
          {billboards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-600 dark:bg-slate-800"><ImagePlus size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" /><p className="text-sm text-slate-400 dark:text-slate-500">No billboards yet</p></div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {billboards.map((b) => (
                <div key={b.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                  <div className="h-32 bg-slate-100 dark:bg-slate-700/50">{b.image_url && <img src={b.image_url} alt={b.title} className="h-full w-full object-cover" />}</div>
                  <div className="p-4">
                    <div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-900 dark:text-white">{b.title}</h3><button onClick={() => deleteBillboard(b.id)} className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50"><Trash2 size={14} /></button></div>
                    <div className="mt-2 flex items-center justify-between"><span className="text-xs text-slate-400 dark:text-slate-500">Position: {b.position}</span><button onClick={() => toggleBillboard(b)} className={`rounded-lg px-2 py-0.5 text-xs font-medium ${b.is_active ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500"}`}>{b.is_active ? "Active" : "Inactive"}</button></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "shops" && (
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {shops.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gula-50 text-sm font-bold text-gula-700 dark:bg-gula-900/50 dark:text-gula-300">{s.name.charAt(0).toUpperCase()}</div><div><p className="text-sm font-medium text-slate-900 dark:text-white">{s.name}</p><p className="text-xs text-slate-400 dark:text-slate-500">{s.category} · {s.university}</p></div></div>
                <div className="flex items-center gap-3"><span className="text-xs text-slate-400 dark:text-slate-500">{s.total_sales} sales</span><span className="text-xs font-medium text-amber-500">{s.rating}★</span><span className={`rounded-full px-2 py-0.5 text-xs ${s.is_active ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500"}`}>{s.is_active ? "Active" : "Inactive"}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3"><div><p className="text-sm font-medium text-slate-900 dark:text-white">{p.name}</p><p className="text-xs text-slate-400 dark:text-slate-500">{p.category}</p></div><div className="flex items-center gap-3"><span className="text-sm font-bold text-slate-900 dark:text-white">KSh {Number(p.price).toLocaleString()}</span><span className="text-xs text-slate-400 dark:text-slate-500">{p.stock} in stock</span></div></div>
            ))}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between px-5 py-3"><div><p className="text-sm font-medium text-slate-900 dark:text-white">{o.buyer_name || "Anonymous"}</p><p className="text-xs text-slate-400 dark:text-slate-500">{new Date(o.created_at).toLocaleDateString()}</p></div><div className="flex items-center gap-3"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-600 dark:bg-slate-700 dark:text-slate-300">{o.status.replace("_", " ")}</span><span className="text-sm font-bold text-slate-900 dark:text-white">KSh {Number(o.total).toLocaleString()}</span></div></div>
            ))}
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-5 py-3"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-gula-50 text-sm font-semibold text-gula-700 dark:bg-gula-900/50 dark:text-gula-300">{u.full_name.charAt(0).toUpperCase()}</div><div><p className="text-sm font-medium text-slate-900 dark:text-white">{u.full_name}</p><p className="text-xs text-slate-400 dark:text-slate-500">{u.email}</p></div></div><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-600 dark:bg-slate-700 dark:text-slate-300">{u.role}</span></div>
            ))}
          </div>
        </div>
      )}

      {showBillboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md animate-fade-in rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Billboard</h3><button onClick={() => setShowBillboardModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><X size={20} /></button></div>
            <div className="space-y-3">
              <div><label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Title</label><input type="text" value={bbForm.title} onChange={(e) => setBbForm({ ...bbForm, title: e.target.value })} className={inputCls} /></div>
              <div><label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Image URL</label><input type="text" value={bbForm.image_url} onChange={(e) => setBbForm({ ...bbForm, image_url: e.target.value })} className={inputCls} placeholder="https://images.pexels.com/..." /></div>
              <div><label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Link URL (optional)</label><input type="text" value={bbForm.link_url} onChange={(e) => setBbForm({ ...bbForm, link_url: e.target.value })} className={inputCls} /></div>
              <div><label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Position</label><input type="number" value={bbForm.position} onChange={(e) => setBbForm({ ...bbForm, position: e.target.value })} className={inputCls} /></div>
            </div>
            <div className="mt-5 flex gap-3"><button onClick={() => setShowBillboardModal(false)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Cancel</button><button onClick={createBillboard} disabled={!bbForm.title || !bbForm.image_url} className="flex-1 rounded-xl bg-gula-600 py-2.5 text-sm font-semibold text-white hover:bg-gula-700 disabled:opacity-50">Create</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
