import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Package, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import type { Shop, Product } from "../types";

export default function ProductsView() {
  const { profile } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "General", stock: "", image_url: "" });

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
        const { data: prodData } = await supabase
          .from("products")
          .select("*")
          .eq("shop_id", s.id)
          .order("created_at", { ascending: false });
        setProducts((prodData ?? []) as Product[]);
      }
      setLoading(false);
    })();
  }, [profile]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", description: "", price: "", category: "General", stock: "", image_url: "" });
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      category: p.category,
      stock: String(p.stock),
      image_url: p.image_url ?? "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!shop) return;
    const payload = {
      shop_id: shop.id,
      name: form.name,
      description: form.description,
      price: parseFloat(form.price) || 0,
      category: form.category,
      stock: parseInt(form.stock) || 0,
      image_url: form.image_url || null,
    };
    if (editing) {
      await supabase.from("products").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("products").insert(payload);
    }
    setShowModal(false);
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("shop_id", shop.id)
      .order("created_at", { ascending: false });
    setProducts((data ?? []) as Product[]);
  };

  const handleDelete = async (id: string) => {
    if (!shop) return;
    await supabase.from("products").delete().eq("id", id);
    setProducts(products.filter((p) => p.id !== id));
  };

  const toggleAvailable = async (p: Product) => {
    await supabase.from("products").update({ is_available: !p.is_available }).eq("id", p.id);
    setProducts(products.map((pr) => (pr.id === p.id ? { ...pr, is_available: !pr.is_available } : pr)));
  };

  if (loading) return <div className="p-6 text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Products</h2>
          <p className="text-sm text-slate-500">{products.length} items in your catalog</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl bg-gula-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gula-700"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Package size={40} className="mx-auto mb-3 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-900">No products yet</h3>
          <p className="mt-1 text-sm text-slate-500">Add your first product to start selling.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex h-32 items-center justify-center bg-slate-100">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <Package size={32} className="text-slate-300" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{p.name}</h3>
                    <p className="text-xs text-slate-400">{p.category}</p>
                  </div>
                  <span className="text-sm font-bold text-gula-700">KSh {Number(p.price).toLocaleString()}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{p.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.stock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  }`}>
                    {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => toggleAvailable(p)} className={`rounded-lg px-2 py-1 text-xs font-medium ${
                      p.is_available ? "bg-gula-50 text-gula-700" : "bg-slate-100 text-slate-400"
                    }`}>
                      {p.is_available ? "Available" : "Hidden"}
                    </button>
                    <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md animate-fade-in rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{editing ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Price (KSh)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Category</label>
                <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Image URL (optional)</label>
                <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20" />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={!form.name || !form.price}
                className="flex-1 rounded-xl bg-gula-600 py-2.5 text-sm font-semibold text-white hover:bg-gula-700 disabled:opacity-50">
                {editing ? "Update" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
