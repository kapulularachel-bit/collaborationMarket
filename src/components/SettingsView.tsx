import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";
import { useTheme } from "../lib/ThemeContext";

const UNIVERSITIES = [
  "University of Nairobi",
  "Kenyatta University",
  "Strathmore University",
  "JKUAT",
  "USIU-Africa",
  "Daystar University",
  "Catholic University of Eastern Africa",
];

export default function SettingsView() {
  const { profile, refreshProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [university, setUniversity] = useState(profile?.university || "");
  const [residence, setResidence] = useState(profile?.residence || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    const { error } = await supabase.from("profiles").update({
      full_name: fullName,
      university: university || null,
      residence: residence || null,
      phone: phone || null,
    }).eq("id", profile.id);
    if (error) setError(error.message);
    else { setSaved(true); await refreshProfile(); }
    setSaving(false);
  };

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600";

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account preferences</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Full Name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Email</label>
            <input value={profile?.email || ""} disabled className={`${inputCls} cursor-not-allowed opacity-60`} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">University</label>
              <select value={university} onChange={(e) => setUniversity(e.target.value)} className={inputCls}>
                <option value="">Not set</option>
                {UNIVERSITIES.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Residence / Hostel</label>
              <input value={residence} onChange={(e) => setResidence(e.target.value)} className={inputCls} placeholder="Hall 3" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+254 7XX XXX XXX" />
          </div>
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-400">{error}</div>}
          {saved && <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">Profile updated successfully.</div>}
          <button onClick={handleSave} disabled={saving} className="rounded-xl bg-gula-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gula-700 disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-300">Theme</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Switch between light and dark mode</p>
          </div>
          <button onClick={toggleTheme} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">Account</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Role: <span className="font-semibold capitalize">{profile?.role}</span></p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Member since: {profile ? new Date(profile.created_at).toLocaleDateString() : "—"}</p>
      </div>
    </div>
  );
}
