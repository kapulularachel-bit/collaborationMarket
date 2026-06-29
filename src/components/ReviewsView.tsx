import React, { useState } from 'react';
import { Star, MessageCircle, Reply, ThumbsUp, CheckSquare } from 'lucide-react';

export default function ReviewsView() {
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      buyerName: 'Wongani Phiri',
      buyerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      rating: 5,
      date: 'Today, 11:30 AM',
      text: 'The Chicken Shawarma was hot, delicious, and incredibly juicy. The garlic herb mayo is out of this world! Fastest hostel delivery at Soche Block!',
      reply: '',
      liked: false
    },
    {
      id: 'rev-2',
      buyerName: 'Thoko Gondwe',
      buyerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      rating: 5,
      date: 'Yesterday',
      text: 'Beef Noodles are exceptional. High portion sizes - easily satisfies two people! Cooked fresh, highly recommend Brenda’s Bites.',
      reply: 'Thanks Thoko! We always aim to make portions satisfying for hungry campus study sessions.',
      liked: true
    },
    {
      id: 'rev-3',
      buyerName: 'Mayamiko Mwale',
      buyerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      rating: 4,
      date: '3 days ago',
      text: 'Grilled cheese sandwiches were amazing, but delivery was delayed by about 10 minutes due to main gate check. Still, bread was warm and crispy.',
      reply: 'Sorry for the delay Mayamiko! The gate courier registration took some extra minutes that afternoon, we will expedite in future.',
      liked: false
    }
  ]);

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [typedReply, setTypedReply] = useState('');

  const submitReply = (id: string) => {
    if (!typedReply.trim()) return;
    setReviews(prev =>
      prev.map(r => r.id === id ? { ...r, reply: typedReply.trim() } : r)
    );
    setTypedReply('');
    setActiveReplyId(null);
  };

  const toggleLike = (id: string) => {
    setReviews(prev =>
      prev.map(r => r.id === id ? { ...r, liked: !r.liked } : r)
    );
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Overview Statistics */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rating score */}
        <div className="flex flex-col items-center justify-center text-center space-y-1.5 md:border-r border-slate-100 dark:border-slate-800">
          <span className="text-3xl font-black text-slate-900 dark:text-white">4.8</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">Average Store Rating (84 votes)</span>
        </div>

        {/* Rating bars */}
        <div className="col-span-2 space-y-2">
          {[
            { stars: 5, percentage: 88, count: 74 },
            { stars: 4, percentage: 8, count: 7 },
            { stars: 3, percentage: 3, count: 2 },
            { stars: 2, percentage: 1, count: 1 },
            { stars: 1, percentage: 0, count: 0 },
          ].map((bar) => (
            <div key={bar.stars} className="flex items-center gap-3 font-semibold text-slate-600 dark:text-slate-300">
              <span className="w-4 text-right font-mono font-black">{bar.stars} ★</span>
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${bar.percentage}%` }}></div>
              </div>
              <span className="w-10 text-right text-slate-400 dark:text-slate-500 font-mono text-[10px]">{bar.count} votes</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews feed */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
          Student Feedback Feed
        </h3>

        <div className="space-y-5 divide-y divide-slate-100 dark:divide-slate-800">
          {reviews.map((r, idx) => (
            <div key={r.id} className={`pt-4 first:pt-0 space-y-3.5`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img
                    src={r.buyerAvatar}
                    alt={r.buyerName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white">{r.buyerName}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-3 h-3 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"}`} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">• {r.date}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleLike(r.id)}
                  className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-bold transition cursor-pointer ${
                    r.liked 
                      ? "bg-emerald-50 dark:bg-emerald-950/20 text-[#2E7D32] dark:text-emerald-400 border-[#2E7D32]/20 dark:border-emerald-900/45" 
                      : "bg-white dark:bg-slate-950 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{r.liked ? "Liked!" : "Helpful"}</span>
                </button>
              </div>

              {/* Review Text */}
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-semibold pl-1">
                "{r.text}"
              </p>

              {/* Reply Box */}
              {r.reply ? (
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 p-3.5 rounded-xl ml-4 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <span className="text-sm">👩‍🍳</span>
                    <span>Brenda's Bites (Shop Owner)</span>
                    <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/40 text-[#2E7D32] dark:text-emerald-400 px-1.5 py-0.2 rounded font-black font-mono">REPLY</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {r.reply}
                  </p>
                </div>
              ) : activeReplyId === r.id ? (
                <div className="ml-4 space-y-2">
                  <textarea
                    placeholder="Type your response to the student review..."
                    value={typedReply}
                    onChange={(e) => setTypedReply(e.target.value)}
                    rows={2}
                    className="w-full border border-slate-200 dark:border-slate-800 focus:border-[#2E7D32] focus:outline-none rounded-xl p-3 bg-slate-50 dark:bg-slate-950 font-semibold text-slate-700 dark:text-slate-300"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setActiveReplyId(null)}
                      className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => submitReply(r.id)}
                      className="bg-[#2E7D32] hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-lg shadow transition cursor-pointer"
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pl-1">
                  <button
                    onClick={() => setActiveReplyId(r.id)}
                    className="text-[#2E7D32] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    Reply to student
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
