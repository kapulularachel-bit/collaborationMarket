import { useEffect, useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Review } from "../types";

export default function ReviewsView({ shopId }: { shopId: string | null }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number | "all">("all");

  useEffect(() => {
    if (!shopId) return;
    supabase.from("reviews").select("*").eq("shop_id", shopId).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setReviews(data as Review[]); setLoading(false); });
  }, [shopId]);

  if (loading) return <div className="p-6 text-sm text-slate-400 dark:text-slate-500">Loading reviews...</div>;

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.rating === filter);
  const avg = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Reviews</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{reviews.length} review(s)</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-4xl font-bold text-slate-900 dark:text-white">{avg}</p>
          <div className="mt-2 flex justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className={i < Math.round(parseFloat(avg) || 0) ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"} />
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Overall Rating</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Rating Distribution</h2>
          <div className="space-y-2">
            {distribution.map((d) => (
              <button key={d.star} onClick={() => setFilter(filter === d.star ? "all" : d.star)} className="flex w-full items-center gap-2">
                <span className="flex w-12 items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  {d.star} <Star size={10} className="fill-amber-400 text-amber-400" />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-8 text-right text-xs text-slate-500 dark:text-slate-400">{d.count}</span>
              </button>
            ))}
          </div>
          {filter !== "all" && (
            <button onClick={() => setFilter("all")} className="mt-3 text-xs text-gula-600 hover:underline dark:text-gula-400">Clear filter</button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-600">
          <MessageSquare size={32} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400 dark:text-slate-500">No reviews {filter !== "all" ? `for ${filter} stars` : "yet"}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gula-600 text-sm font-bold text-white">
                    {r.buyer_name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{r.buyer_name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"} />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
