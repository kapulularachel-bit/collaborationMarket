import { LayoutDashboard, Store, Package, ClipboardList, Truck, MessageSquare, Tag, ChartBar as BarChart3, Wallet, Star, Settings, Shield } from "lucide-react";
import type { Profile } from "../types";

export type ViewName =
  | "dashboard"
  | "shop"
  | "products"
  | "orders"
  | "deliveries"
  | "messages"
  | "promotions"
  | "analytics"
  | "payouts"
  | "reviews"
  | "settings"
  | "admin";

interface SidebarProps {
  current: ViewName;
  onNavigate: (view: ViewName) => void;
  profile: Profile;
  unreadMessages: number;
}

const sellerNav = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "shop" as const, label: "My Shop", icon: Store },
  { id: "products" as const, label: "Products", icon: Package },
  { id: "orders" as const, label: "Orders", icon: ClipboardList },
  { id: "deliveries" as const, label: "Deliveries", icon: Truck },
  { id: "messages" as const, label: "Messages", icon: MessageSquare, badge: true },
  { id: "promotions" as const, label: "Promotions", icon: Tag },
  { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
  { id: "payouts" as const, label: "Payouts", icon: Wallet },
  { id: "reviews" as const, label: "Reviews", icon: Star },
  { id: "settings" as const, label: "Settings", icon: Settings },
];

export default function Sidebar({ current, onNavigate, profile, unreadMessages }: SidebarProps) {
  const navItems = profile.role === "admin"
    ? [
        { id: "admin" as const, label: "Admin Portal", icon: Shield },
        { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
        { id: "settings" as const, label: "Settings", icon: Settings },
      ]
    : sellerNav;

  return (
    <aside className="flex h-full w-60 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gula-600 text-white">
          <span className="text-lg font-bold">G</span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">GULA</p>
          <p className="text-[10px] text-slate-400">Marketplace</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-gula-50 text-gula-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={18} className={active ? "text-gula-600" : "text-slate-400"} />
              <span className="flex-1 text-left">{item.label}</span>
              {"badge" in item && item.badge && unreadMessages > 0 && (
                <span className="rounded-full bg-gula-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {unreadMessages}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gula-100 text-sm font-semibold text-gula-700">
            {profile.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{profile.full_name}</p>
            <p className="truncate text-[10px] capitalize text-slate-400">{profile.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
