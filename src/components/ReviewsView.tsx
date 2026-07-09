import { useEffect, useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import type { Shop, Review } from "../types";

export default function ReviewsView() {
  const { profile } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const { data: shopData } = await supabase.from("shops").select("*").eq("seller_id", profile.id).maybeSingle();
      const s = shopData as Shop | null;
      setShop(s);
      if (s) {
        const { data: reviewData } = await supabase.from("reviews").select("*").eq("shop_id", s.id).order("created_at", { ascending: false });
        setReviews((reviewData ?? []) as Review[]);
      }
      setLoading(false);
    })();
  }, [profile]);

  if (loading) return <div className="p-6 text-slate-400 dark:text-slate-500">Loading...</div>;

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((r) => r.rating === star).length }));
  const maxDist = Math.max(...ratingDist.map((d) => d.count), 1);

  return (
    <div className="space-y-6 p-6">
      <div><h2 className="text-xl font-bold text-slate-900 dark:text-white">Reviews</h2><p className="text-sm text-slate-500 dark:text-slate-400">What customers are saying about your shop</p></div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <div className="text-center">
            <p className="text-4xl font-bold text-slate-900 dark:text-white">{avgRating.toFixed(1)}</p>
            <div className="mt-1 flex justify-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={16} className={i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-600"} />))}</div>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{reviews.length} reviews</p>
          </div>
          <div className="mt-4 space-y-2">
            {ratingDist.map((d) => (
              <div key={d.star} className="flex items-center gap-2">
                <span className="flex w-4 items-center gap-0.5 text-xs text-slate-400 dark:text-slate-500">{d.star}<Star size={10} className="fill-amber-400 text-amber-400" /></span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"><div className="h-full rounded-full bg-amber-400" style={{ width: `${(d.count / maxDist) * 100}%` }} /></div>
                <span className="w-6 text-right text-xs text-slate-400 dark:text-slate-500">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700"><h3 className="text-sm font-semibold text-slate-900 dark:text-white">All Reviews</h3></div>
            {reviews.length === 0 ? (
              <div className="px-5 py-12 text-center"><MessageSquare size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" /><p className="text-sm text-slate-400 dark:text-slate-500">No reviews yet</p><p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Reviews from your customers will appear here.</p></div>
            ) : (
              <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {reviews.map((r) => (
                  <div key={r.id} className="px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gula-50 text-sm font-semibold text-gula-700 dark:bg-gula-900/50 dark:text-gula-300">{r.buyer_name?.charAt(0).toUpperCase() ?? "?"}</div>
                        <div><p className="text-sm font-medium text-slate-900 dark:text-white">{r.buyer_name}</p><p className="text-xs text-slate-400 dark:text-slate-500">{new Date(r.created_at).toLocaleDateString()}</p></div>
                      </div>
                      <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={12} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-600"} />))}</div>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
