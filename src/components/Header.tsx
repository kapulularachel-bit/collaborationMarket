import { useState, useEffect, useRef } from "react";
import { Menu, Bell, Sun, Moon, LogOut, User } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { useTheme } from "../lib/ThemeContext";
import { supabase } from "../lib/supabase";
import type { Notification } from "../types";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile) return;
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => { if (data) setNotifs(data as Notification[]); });
  }, [profile]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifs.filter((n) => !n.is_read).length;
  const initials = (profile?.full_name || "U").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
      <button onClick={onMenuClick} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 lg:hidden">
        <Menu size={20} />
      </button>
      <div className="hidden lg:block">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {profile?.role === "admin" ? "Admin Portal" : "Seller Dashboard"}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{profile?.university || "GULA Marketplace"}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifs((s) => !s)} className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700">
            <Bell size={18} />
            {unread > 0 && <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gula-600 text-[10px] font-bold text-white">{unread}</span>}
          </button>
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifs.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs text-slate-400 dark:text-slate-500">No notifications</p>
                ) : notifs.map((n) => (
                  <div key={n.id} className={`border-b border-slate-100 px-4 py-3 dark:border-slate-700 ${!n.is_read ? "bg-gula-50 dark:bg-gula-950/30" : ""}`}>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{n.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{n.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setShowMenu((s) => !s)} className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-700">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gula-600 text-xs font-bold text-white">{initials}</div>
            <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">{profile?.full_name}</span>
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{profile?.full_name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{profile?.email}</p>
              </div>
              <button onClick={signOut} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
