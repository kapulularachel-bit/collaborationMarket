import { LayoutDashboard, Store, Package, ShoppingCart, Truck, MessageSquare, Tag, ChartBar as BarChart3, Wallet, Star, Settings, ShieldCheck } from "lucide-react";
import type { ViewName } from "../App";
import type { Profile } from "../types";

interface NavItem {
  id: ViewName;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

const sellerNav: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "shop", label: "My Shop", icon: Store },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "deliveries", label: "Deliveries", icon: Truck },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "promotions", label: "Promotions", icon: Tag },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "payouts", label: "Payouts", icon: Wallet },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "settings", label: "Settings", icon: Settings },
];

const adminNav: NavItem[] = [
  { id: "admin", label: "Admin Portal", icon: ShieldCheck },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  view, setView, profile, open, onClose,
}: {
  view: ViewName;
  setView: (v: ViewName) => void;
  profile: Profile | null;
  open: boolean;
  onClose: () => void;
}) {
  const nav = profile?.role === "admin" ? adminNav : sellerNav;

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white transition-transform dark:border-slate-700 dark:bg-slate-800 lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5 dark:border-slate-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gula-600 shadow-sm">
            <span className="text-lg font-bold text-white">G</span>
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">GULA</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setView(item.id); onClose(); }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-gula-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-4 dark:border-slate-700">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {profile?.role === "admin" ? "Admin Portal" : "Seller Dashboard"}
          </p>
        </div>
      </aside>
    </>
  );
}
