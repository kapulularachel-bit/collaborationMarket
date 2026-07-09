import { useEffect, useState } from "react";
import { Store, Package, ShoppingCart, Users, ImagePlus, Trash2, ShieldCheck, TrendingUp, DollarSign, Activity } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Shop, Product, Order, Profile, Billboard } from "../types";

type Tab = "overview" | "billboards" | "shops" | "products" | "orders" | "users";

export default function AdminPortalView() {
  const [tab, setTab] = useState<Tab>("overview");
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("shops").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("billboards").select("*").order("position", { ascending: true }),
    ]).then(([s, p, o, u, b]) => {
      if (s.data) setShops(s.data as Shop[]);
      if (p.data) setProducts(p.data as Product[]);
      if (o.data) setOrders(o.data as Order[]);
      if (u.data) setUsers(u.data as Profile[]);
      if (b.data) setBillboards(b.data as Billboard[]);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-6 text-sm text-slate-400 dark:text-slate-500">Loading admin portal...</div>;

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "billboards", label: "Billboards" },
    { id: "shops", label: "Shops" },
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
    { id: "users", label: "Users" },
  ];

  const totalRevenue = orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0);
  const activeShops = shops.filter((s) => s.is_active).length;
  const sellers = users.filter((u) => u.role === "seller").length;
  const buyers = users.filter((u) => u.role === "buyer").length;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gula-600 shadow-sm">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Portal</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Platform management dashboard</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 dark:border-slate-700">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              tab === t.id
                ? "bg-gula-600 text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: "Total Shops", value: shops.length, sub: `${activeShops} active`, icon: Store, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40" },
              { label: "Total Products", value: products.length, sub: `${products.filter((p) => p.is_available).length} available`, icon: Package, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40" },
              { label: "Total Orders", value: orders.length, sub: `${orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length} active`, icon: ShoppingCart, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/40" },
              { label: "Total Users", value: users.length, sub: `${sellers} sellers, ${buyers} buyers`, icon: Users, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                    <Icon size={20} className={s.color} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{s.sub}</p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-3 flex items-center gap-2">
                <DollarSign size={16} className="text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Platform Revenue</h2>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">KSh {totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">From {orders.filter((o) => o.status === "delivered").length} delivered orders</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Avg Order Value</h2>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">KSh {orders.length > 0 ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length).toLocaleString() : 0}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Across all orders</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-3 flex items-center gap-2">
                <Activity size={16} className="text-amber-600 dark:text-amber-400" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Active Billboards</h2>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{billboards.filter((b) => b.is_active).length}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Of {billboards.length} total</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Recent Orders</h2>
            <div className="space-y-2">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-700">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{o.buyer_name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{o.items.length} item(s) · KSh {o.total}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${orderStatusColor(o.status)}`}>{o.status.replace(/_/g, " ")}</span>
                </div>
              ))}
              {orders.length === 0 && <p className="py-4 text-center text-xs text-slate-400 dark:text-slate-500">No orders yet</p>}
            </div>
          </div>
        </div>
      )}

      {tab === "billboards" && <BillboardsTab billboards={billboards} setBillboards={setBillboards} />}

      {tab === "shops" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Shop</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">University</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Sales</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0 dark:border-slate-700">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{s.name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{s.category}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{s.university}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{s.rating} ★</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{s.total_sales}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.is_active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"}`}>
                      {s.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "products" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0 dark:border-slate-700">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{p.name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{p.category}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">KSh {p.price}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.is_available ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"}`}>
                      {p.is_available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "orders" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Buyer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Items</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-slate-100 last:border-0 dark:border-slate-700">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{o.buyer_name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{o.items.length}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">KSh {o.total}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${orderStatusColor(o.status)}`}>{o.status.replace(/_/g, " ")}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "users" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">University</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 last:border-0 dark:border-slate-700">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{u.full_name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                      u.role === "admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400" :
                      u.role === "seller" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400" :
                      "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.university || "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BillboardsTab({ billboards, setBillboards }: { billboards: Billboard[]; setBillboards: React.Dispatch<React.SetStateAction<Billboard[]>> }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [position, setPosition] = useState("1");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setSaving(true);
    setError(null);
    const { data, error } = await supabase.from("billboards").insert({
      title,
      image_url: imageUrl,
      link_url: linkUrl || null,
      position: parseInt(position) || 1,
      is_active: true,
      starts_at: new Date().toISOString(),
      ends_at: new Date(Date.now() + 30 * 86400000).toISOString(),
    }).select().single();
    if (error) setError(error.message);
    else {
      setBillboards((prev) => [...prev, data as Billboard].sort((a, b) => a.position - b.position));
      setShowForm(false);
      setTitle(""); setImageUrl(""); setLinkUrl(""); setPosition("1");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this billboard?")) return;
    await supabase.from("billboards").delete().eq("id", id);
    setBillboards((prev) => prev.filter((b) => b.id !== id));
  };

  const toggleActive = async (b: Billboard) => {
    await supabase.from("billboards").update({ is_active: !b.is_active }).eq("id", b.id);
    setBillboards((prev) => prev.map((p) => p.id === b.id ? { ...p, is_active: !p.is_active } : p));
  };

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Billboards ({billboards.length})</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 rounded-xl bg-gula-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gula-700">
          <ImagePlus size={16} /> Add Billboard
        </button>
      </div>

      {billboards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-600">
          <p className="text-sm text-slate-400 dark:text-slate-500">No billboards yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {billboards.map((b) => (
            <div key={b.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="h-32 bg-slate-100 dark:bg-slate-700">
                {b.image_url && <img src={b.image_url} alt={b.title} className="h-full w-full object-cover" />}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{b.title}</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Position {b.position}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${b.is_active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"}`}>
                    {b.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => toggleActive(b)} className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                    {b.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">New Billboard</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="Summer Sale" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Image URL</label>
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputCls} placeholder="https://..." />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Link URL (optional)</label>
                <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className={inputCls} placeholder="https://..." />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Position</label>
                <input type="number" value={position} onChange={(e) => setPosition(e.target.value)} className={inputCls} />
              </div>
              {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-400">{error}</div>}
              <div className="flex gap-2">
                <button onClick={handleCreate} disabled={saving || !title} className="flex-1 rounded-xl bg-gula-600 py-2.5 text-sm font-semibold text-white hover:bg-gula-700 disabled:opacity-50">
                  {saving ? "Creating..." : "Create"}
                </button>
                <button onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function orderStatusColor(status: string) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
    preparing: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
    ready: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400",
    out_for_delivery: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400",
    delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  };
  return map[status] || "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
}
