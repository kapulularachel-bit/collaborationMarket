import React from 'react';
import { Tag, Plus, Trash2, Gift, Eye, Percent } from 'lucide-react';
import { Promotion, Product } from '../types';

interface PromotionsViewProps {
  promotions: Promotion[];
  products: Product[];
  setIsCreatePromotionOpen: (open: boolean) => void;
  onDeletePromotion: (promotionId: string) => void;
}

export default function PromotionsView({
  promotions,
  products,
  setIsCreatePromotionOpen,
  onDeletePromotion
}: PromotionsViewProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#2E7D32]" />
            Promotions Registry
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Publish student-exclusive discount offers and deals on GULA</p>
        </div>
        <button
          onClick={() => setIsCreatePromotionOpen(true)}
          className="bg-[#2E7D32] hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" /> Create New Deal
        </button>
      </div>

      {/* Grid List */}
      {promotions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promotions.map((p) => {
            const prod = products.find(item => item.id === p.productId);
            return (
              <div key={p.id} className="border border-purple-200/80 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/20 p-5 rounded-2xl flex flex-col justify-between hover:shadow-xs transition">
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 rounded-xl shrink-0">
                    <Percent className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[10px] font-black px-2 py-0.5 rounded-lg border border-purple-200 dark:border-purple-800/60 uppercase tracking-wide">
                      {p.discountPercent}% OFF ACTIVE
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-2 truncate">{p.productName}</h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Original: <span className="line-through">MWK {prod?.price.toLocaleString() || "5,000"}</span> • Deal Price: <span className="font-bold text-[#2E7D32] dark:text-emerald-400 font-mono">MWK {((prod?.price || 5000) * (1 - p.discountPercent / 100)).toLocaleString()}</span></p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-100/60 dark:border-purple-950 flex items-center justify-between text-xs">
                  <span className="text-purple-700 dark:text-purple-400 font-extrabold font-mono">Expires: {p.expiryDate}</span>
                  <button
                    onClick={() => onDeletePromotion(p.id)}
                    className="text-red-600 dark:text-red-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Cancel Offer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-950/20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No active promotions currently.</p>
          <p className="text-xs text-slate-400 mt-1">Sellers publish student discounts to increase search matches and boost orders.</p>
        </div>
      )}
    </div>
  );
}
