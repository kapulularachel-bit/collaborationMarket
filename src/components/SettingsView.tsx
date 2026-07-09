import { useState } from "react";
import { Save, User, Bell, Shield, Sun, Moon } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { useTheme } from "../lib/ThemeContext";
import { supabase } from "../lib/supabase";

export default function SettingsView() {
  const { profile, refreshProfile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({ full_name: profile?.full_name ?? "", phone: profile?.phone ?? "", university: profile?.university ?? "", residence: profile?.residence ?? "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    await supabase.from("profiles").update({ full_name: form.full_name, phone: form.phone, university: form.university, residence: form.residence }).eq("id", profile.id);
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600";

  return (
    <div className="space-y-6 p-6">
      <div><h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2><p className="text-sm text-slate-500 dark:text-slate-400">Manage your account and preferences</p></div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex items-center gap-2"><User size={18} className="text-gula-600 dark:text-gula-400" /><h3 className="text-sm font-semibold text-slate-900 dark:text-white">Profile Information</h3></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div><label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Full Name</label><input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inputCls} /></div>
          <div><label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Email</label><input type="email" value={profile?.email ?? ""} disabled className={`${inputCls} cursor-not-allowed opacity-60`} /></div>
          <div><label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Phone</label><input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="+254..." /></div>
          <div><label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">University</label><input type="text" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} className={inputCls} /></div>
          <div><label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Residence</label><input type="text" value={form.residence} onChange={(e) => setForm({ ...form, residence: e.target.value })} className={inputCls} /></div>
          <div><label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">Role</label><input type="text" value={profile?.role ?? ""} disabled className={`${inputCls} cursor-not-allowed opacity-60`} /></div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-gula-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gula-700 disabled:opacity-50">{saving ? "Saving..." : <><Save size={16} /> Save Changes</>}</button>
          {saved && <span className="text-sm text-emerald-600 dark:text-emerald-400">Saved!</span>}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex items-center gap-2"><Sun size={18} className="text-gula-600 dark:text-gula-400" /><h3 className="text-sm font-semibold text-slate-900 dark:text-white">Appearance</h3></div>
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-700/50">
          <div className="flex items-center gap-3">
            {theme === "dark" ? <Moon size={18} className="text-slate-300" /> : <Sun size={18} className="text-amber-500" />}
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Theme</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Currently using {theme} mode</p>
            </div>
          </div>
          <button onClick={toggleTheme} className="rounded-xl bg-gula-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gula-700">
            Switch to {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex items-center gap-2"><Bell size={18} className="text-gula-600 dark:text-gula-400" /><h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3></div>
        <div className="space-y-3">
          {["New orders", "Delivery updates", "Customer messages", "Promotion alerts"].map((item) => (
            <div key={item} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 dark:bg-slate-700/50">
              <span className="text-sm text-slate-600 dark:text-slate-300">{item}</span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" defaultChecked className="peer sr-only" />
                <div className="h-5 w-9 rounded-full bg-slate-300 transition peer-checked:bg-gula-600 dark:bg-slate-600" />
                <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
        <div className="mb-4 flex items-center gap-2"><Shield size={18} className="text-red-500" /><h3 className="text-sm font-semibold text-slate-900 dark:text-white">Danger Zone</h3></div>
        <button onClick={() => signOut()} className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-800 dark:bg-slate-800 dark:hover:bg-red-950/50">Sign Out</button>
      </div>
    </div>
  );
}
