import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  Truck, 
  MessageSquare, 
  Tag, 
  BarChart3, 
  Store, 
  Wallet, 
  Star, 
  Settings, 
  Headphones,
  ChevronDown,
  Percent
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  ordersBadgeCount: number;
  deliveriesBadgeCount: number;
  messagesBadgeCount: number;
  setIsCreatePromotionOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  ordersBadgeCount,
  deliveriesBadgeCount,
  messagesBadgeCount,
  setIsCreatePromotionOpen
}: SidebarProps) {

  // Links corresponding to the 11 sidebar tabs in the screenshot
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Products', icon: ShoppingBag },
    { name: 'Orders', icon: ClipboardList, badge: ordersBadgeCount, badgeColor: 'bg-emerald-600' },
    { name: 'Deliveries', icon: Truck, badge: deliveriesBadgeCount, badgeColor: 'bg-blue-600' },
    { name: 'Messages', icon: MessageSquare, badge: messagesBadgeCount, badgeColor: 'bg-red-500' },
    { name: 'Promotions', icon: Tag },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Shop', icon: Store },
    { name: 'Payouts', icon: Wallet },
    { name: 'Reviews', icon: Star },
    { name: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-850 shrink-0 hidden lg:flex flex-col h-screen sticky top-0">
      {/* Sidebar Header Dropdown */}
      <div className="p-4.5 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 bg-[#2E7D32] rounded-full flex items-center justify-center text-white shrink-0 shadow-sm shadow-emerald-700/25">
            <span className="text-base">🥗</span>
          </div>
          <div>
            <span className="font-extrabold text-slate-900 dark:text-white text-[13px] tracking-wide block">GULA Seller</span>
            <span className="text-[10px] text-[#2E7D32] dark:text-emerald-400 font-black uppercase tracking-wider block">MUBAS Campus</span>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {menuItems.map((item) => {
          const isActive = activeTab === item.name;
          const IconComponent = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-emerald-50 dark:bg-emerald-950/35 text-[#2E7D32] dark:text-emerald-400"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-[#2E7D32] dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`} />
                <span>{item.name}</span>
              </div>
              
              {/* Optional Sidebar Badges */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`${item.badgeColor || "bg-emerald-600"} text-white text-[9.5px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center font-mono shrink-0 scale-90`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Extra Widget Cards inside Sidebar */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-850 space-y-4 bg-slate-50/50 dark:bg-slate-950/30">
        {/* Store Health circular chart gauge */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl flex items-center gap-3.5 shadow-2xs">
          {/* Circular ring */}
          <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="22" cy="22" r="18" fill="transparent" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="3.5" />
              <circle 
                cx="22" 
                cy="22" 
                r="18" 
                fill="transparent" 
                stroke="#2E7D32" 
                strokeWidth="3.5" 
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={(2 * Math.PI * 18) * (1 - 0.92)}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[10px] font-black text-slate-800 dark:text-slate-200 font-mono">92%</span>
          </div>
          <div>
            <h4 className="text-[11px] font-black text-slate-900 dark:text-white leading-tight">Store Health: Excellent</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Keep up the good work!</p>
          </div>
        </div>

        {/* Create Promotion Box */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl space-y-2 shadow-2xs">
          <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Percent className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Grow your business
          </h4>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
            Boost your sales with promotions and reach more students.
          </p>
          <button
            onClick={() => setIsCreatePromotionOpen(true)}
            className="w-full bg-[#2E7D32] hover:bg-emerald-700 text-white text-[10.5px] font-black py-2 rounded-xl text-center shadow-xs transition cursor-pointer"
          >
            Create Promotion
          </button>
          <button 
            onClick={() => alert("Help documentation: Promotions let you set customized percentage-off discounts across your catalog which show up prominently in GULA's homepage slider carousels!")}
            className="text-[10px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 block text-center font-bold"
          >
            Learn more
          </button>
        </div>

        {/* Sidebar Help desk Link */}
        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 justify-center font-bold">
          <Headphones className="w-3.5 h-3.5" />
          <span>Need help? Visit our Help Center</span>
        </div>
      </div>
    </aside>
  );
}
