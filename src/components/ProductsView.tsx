import React, { useState } from 'react';
import { ShoppingBag, Plus, Edit2, Trash2, Search, Filter, Layers } from 'lucide-react';
import { Product } from '../types';

interface ProductsViewProps {
  products: Product[];
  setIsAddProductOpen: (open: boolean) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateProductStock: (productId: string, newStock: number) => void;
}

export default function ProductsView({
  products,
  setIsAddProductOpen,
  onDeleteProduct,
  onUpdateProductStock
}: ProductsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Food & Meals', 'Drinks & Beverages', 'Stationery', 'Clothing', 'Electronics'];

  // Filter items
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#2E7D32]" />
            My Product Catalog
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Manage and list items for students on GULA</p>
        </div>
        <button
          onClick={() => setIsAddProductOpen(true)}
          className="bg-[#2E7D32] hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" /> Add New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2E7D32] dark:focus:border-[#2E7D32] focus:outline-none rounded-xl transition font-semibold text-slate-700 dark:text-slate-300"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition border shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/20"
                  : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs transition duration-200 flex flex-col justify-between">
              <div>
                <div className="relative h-44 bg-slate-100 dark:bg-slate-950">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-white/95 dark:bg-slate-900/95 px-2 py-0.5 rounded-lg text-[9px] font-extrabold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-800 uppercase tracking-wide">
                    {p.condition}
                  </div>
                  {p.stock === 0 ? (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-3xs flex items-center justify-center">
                      <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        Out of Stock
                      </span>
                    </div>
                  ) : p.stock <= 3 ? (
                    <div className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Low Stock
                    </div>
                  ) : null}
                </div>

                <div className="p-4 space-y-1.5">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{p.category}</span>
                    <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">ID: {p.id}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight line-clamp-1">{p.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed h-8">{p.description}</p>
                </div>
              </div>

              {/* Product Card Actions */}
              <div className="px-4 pb-4 pt-2 border-t border-slate-100/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block">PRICE</span>
                  <span className="text-sm font-black text-slate-950 dark:text-white font-mono">MWK {p.price.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Stock quick adjuster */}
                  <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden h-7">
                    <button
                      onClick={() => onUpdateProductStock(p.id, Math.max(0, p.stock - 1))}
                      disabled={p.stock === 0}
                      className="px-2 font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 text-xs cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-2.5 text-xs font-extrabold text-slate-800 dark:text-slate-200 font-mono">{p.stock}</span>
                    <button
                      onClick={() => onUpdateProductStock(p.id, p.stock + 1)}
                      className="px-2 font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      const ans = prompt(`Update name for "${p.name}":`, p.name);
                      if (ans && ans.trim()) {
                        // Demo notification
                        alert("Details updated!");
                      }
                    }}
                    className="p-1.5 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition cursor-pointer"
                    title="Edit Product"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                        onDeleteProduct(p.id);
                      }
                    }}
                    className="p-1.5 bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-900 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-950/20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No products match your filters.</p>
          <p className="text-xs text-slate-400 mt-1">Try modifying your search query or categories, or add a new product!</p>
        </div>
      )}
    </div>
  );
}
