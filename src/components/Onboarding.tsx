import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { profile, refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [university, setUniversity] = useState("");
  const [residence, setResidence] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopCategory, setShopCategory] = useState("Food");
  const [shopDescription, setShopDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProfileUpdate = async () => {
    if (!profile) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase
      .from("profiles")
      .update({ university, residence, role: "seller" })
      .eq("id", profile.id);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    await refreshProfile();
    setStep(1);
    setLoading(false);
  };

  const handleShopCreate = async () => {
    if (!profile) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("shops").insert({
      seller_id: profile.id,
      name: shopName,
      description: shopDescription,
      category: shopCategory,
      university,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    onComplete();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gula-50 via-slate-50 to-emerald-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${i <= step ? "w-8 bg-gula-600" : "w-4 bg-slate-200"}`}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {step === 0 ? (
            <>
              <h2 className="mb-1 text-xl font-bold text-slate-900">Set up your profile</h2>
              <p className="mb-5 text-sm text-slate-500">Tell us where you study and live.</p>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">University</label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20"
                    placeholder="University of Nairobi"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">Residence / Hostel</label>
                  <input
                    type="text"
                    value={residence}
                    onChange={(e) => setResidence(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20"
                    placeholder="Hall 3"
                  />
                </div>
                {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}
                <button
                  onClick={handleProfileUpdate}
                  disabled={loading || !university || !residence}
                  className="w-full rounded-xl bg-gula-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gula-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Continue"}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="mb-1 text-xl font-bold text-slate-900">Create your shop</h2>
              <p className="mb-5 text-sm text-slate-500">Set up your storefront to start selling.</p>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">Shop Name</label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20"
                    placeholder="Brenda's Kitchen"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">Category</label>
                  <select
                    value={shopCategory}
                    onChange={(e) => setShopCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20"
                  >
                    <option>Food</option>
                    <option>Snacks</option>
                    <option>Drinks</option>
                    <option>Stationery</option>
                    <option>Electronics</option>
                    <option>Fashion</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">Description</label>
                  <textarea
                    value={shopDescription}
                    onChange={(e) => setShopDescription(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20"
                    placeholder="Fresh homemade meals delivered to your hostel..."
                  />
                </div>
                {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}
                <button
                  onClick={handleShopCreate}
                  disabled={loading || !shopName}
                  className="w-full rounded-xl bg-gula-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gula-700 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Shop & Start Selling"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
