import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Product } from "../types";

export default function ProductsView({ shopId }: { shopId: string | null }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Food");
  const [stock, setStock] = useState("10");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = () => {
    if (!shopId) return;
    supabase.from("products").select("*").eq("shop_id", shopId).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setProducts(data as Product[]); setLoading(false); });
  };

  useEffect(() => { fetchProducts(); }, [shopId]);

  const openForm = (p?: Product) => {
    if (p) {
      setEditing(p);
      setName(p.name); setDescription(p.description); setPrice(String(p.price));
      setCategory(p.category); setStock(String(p.stock)); setImageUrl(p.image_url || "");
    } else {
      setEditing(null);
      setName(""); setDescription(""); setPrice(""); setCategory("Food"); setStock("10"); setImageUrl("");
    }
    setError(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!shopId) return;
    setSaving(true);
    setError(null);
    const payload = {
      shop_id: shopId,
      name, description,
      price: parseFloat(price) || 0,
      category,
      stock: parseInt(stock) || 0,
      image_url: imageUrl || null,
      is_available: (parseInt(stock) || 0) > 0,
    };
    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) setError(error.message);
    else { setShowForm(false); fetchProducts(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  const toggleAvailable = async (p: Product) => {
    await supabase.from("products").update({ is_available: !p.is_available }).eq("id", p.id);
    fetchProducts();
  };

  if (loading) return <div className="p-6 text-sm text-slate-400 dark:text-slate-500">Loading products...</div>;

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600";

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Products</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{products.length} item(s) in your catalog</p>
        </div>
        <button onClick={() => openForm()} className="flex items-center gap-1.5 rounded-xl bg-gula-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gula-700">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-600">
          <p className="text-sm text-slate-400 dark:text-slate-500">No products yet. Click "Add Product" to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="flex h-32 items-center justify-center bg-slate-100 dark:bg-slate-700">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-slate-300 dark:text-slate-600">{p.name[0]}</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{p.name}</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{p.category}</p>
                  </div>
                  <span className="text-sm font-bold text-gula-600 dark:text-gula-400">KSh {p.price}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{p.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.is_available ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"}`}>
                    {p.is_available ? `In stock (${p.stock})` : "Out of stock"}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => toggleAvailable(p)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" title="Toggle availability">
                      <span className="text-xs">{p.is_available ? "Hide" : "Show"}</span>
                    </button>
                    <button onClick={() => openForm(p)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editing ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Chicken Pilau" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Price (KSh)</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} placeholder="250" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Stock</label>
                  <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className={inputCls} placeholder="10" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                  <option>Food</option><option>Drinks</option><option>Snacks</option>
                  <option>Stationery</option><option>Electronics</option><option>Fashion</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Image URL (optional)</label>
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputCls} placeholder="https://..." />
              </div>
              {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-400">{error}</div>}
              <button onClick={handleSave} disabled={saving || !name} className="w-full rounded-xl bg-gula-600 py-2.5 text-sm font-semibold text-white hover:bg-gula-700 disabled:opacity-50">
                {saving ? "Saving..." : editing ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
