import React from 'react';
import { 
  ShoppingBag, 
  ClipboardList, 
  Truck, 
  TrendingUp, 
  Plus, 
  Store, 
  MessageSquare, 
  Tag, 
  BarChart3, 
  Phone, 
  MoreVertical, 
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play
} from 'lucide-react';
import { Product, Order, Delivery, Chat, Promotion } from '../types';

interface DashboardViewProps {
  products: Product[];
  orders: Order[];
  deliveries: Delivery[];
  chats: Chat[];
  promotions: Promotion[];
  setActiveTab: (tab: string) => void;
  setIsAddProductOpen: (open: boolean) => void;
  setIsCreatePromotionOpen: (open: boolean) => void;
  onUpdateOrderStatus: (orderId: string, status: any) => void;
  onUpdateDeliveryStatus: (deliveryId: string, status: any) => void;
}

export default function DashboardView({
  products,
  orders,
  deliveries,
  chats,
  promotions,
  setActiveTab,
  setIsAddProductOpen,
  setIsCreatePromotionOpen,
  onUpdateOrderStatus,
  onUpdateDeliveryStatus
}: DashboardViewProps) {

  // Metrics calculations
  const totalProductsCount = products.length;
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const pendingDeliveriesCount = deliveries.filter(d => d.status !== 'Delivered' && d.status !== 'Cancelled').length;
  const totalSalesThisMonth = 450000; // MWK - locked to screenshot

  // Helper for order status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ready for Delivery':
        return (
          <span className="bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Ready for Delivery
          </span>
        );
      case 'Accepted':
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Accepted
          </span>
        );
      case 'Delivered':
        return (
          <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Cancelled
          </span>
        );
      case 'Preparing':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Preparing
          </span>
        );
      default:
        return (
          <span className="bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  // Helper for delivery status badge styling
  const getDeliveryBadge = (status: string) => {
    switch (status) {
      case 'Out for Delivery':
        return (
          <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-lg">
            Out for Delivery
          </span>
        );
      case 'Preparing Order':
        return (
          <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-lg">
            Preparing Order
          </span>
        );
      case 'Ready for Pickup':
        return (
          <span className="bg-purple-50 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-lg">
            Ready for Pickup
          </span>
        );
      default:
        return (
          <span className="bg-slate-50 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-lg">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP METRIC CARDS ROW */}
      <div id="metrics-row" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Products</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalProductsCount}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">(Active)</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>▲ 8 vs last month</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/35 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Orders</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{activeOrdersCount}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">({orders.filter(o => o.status === 'Pending').length} Pending)</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>▲ 12 vs last month</span>
            </div>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/35 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Deliveries */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pending Deliveries</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{pendingDeliveriesCount}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">(In Progress)</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>▲ 5 vs last month</span>
            </div>
          </div>
          <div className="p-3 bg-sky-50 dark:bg-sky-950/35 rounded-xl text-sky-600 dark:text-sky-400 shrink-0">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Sales (This Month)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">MWK {totalSalesThisMonth.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>▲ 18% vs last month</span>
            </div>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/35 rounded-xl text-purple-600 dark:text-purple-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. QUICK ACTIONS SECTION */}
      <div id="quick-actions" className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-wider mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5">
          <button 
            onClick={() => setIsAddProductOpen(true)}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/45 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900/50 rounded-xl transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/60 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/80 text-[#2E7D32] dark:text-emerald-400 rounded-full flex items-center justify-center mb-2.5 transition">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Add Product</span>
          </button>

          <button 
            onClick={() => setActiveTab('Shop')}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/45 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900/50 rounded-xl transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/60 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/80 text-[#2E7D32] dark:text-emerald-400 rounded-full flex items-center justify-center mb-2.5 transition">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Manage Shop</span>
          </button>

          <button 
            onClick={() => setActiveTab('Orders')}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/45 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 border border-slate-100 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900/50 rounded-xl transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950/60 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/80 text-amber-700 dark:text-amber-400 rounded-full flex items-center justify-center mb-2.5 transition">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">View Orders</span>
          </button>

          <button 
            onClick={() => setActiveTab('Messages')}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/45 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 border border-slate-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-900/50 rounded-xl transition-all cursor-pointer group relative"
          >
            <div className="w-10 h-10 bg-sky-100 dark:bg-sky-950/60 group-hover:bg-sky-200 dark:group-hover:bg-sky-900/80 text-sky-700 dark:text-sky-400 rounded-full flex items-center justify-center mb-2.5 transition">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Messages</span>
            <span className="absolute top-3 right-6 bg-red-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
              3
            </span>
          </button>

          <button 
            onClick={() => setIsCreatePromotionOpen(true)}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/45 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 border border-slate-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-900/50 rounded-xl transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950/60 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/80 text-purple-700 dark:text-purple-400 rounded-full flex items-center justify-center mb-2.5 transition">
              <Tag className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Promotions</span>
          </button>

          <button 
            onClick={() => setActiveTab('Analytics')}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/45 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 border border-slate-100 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-900/50 rounded-xl transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-950/60 group-hover:bg-teal-200 dark:group-hover:bg-teal-900/80 text-teal-700 dark:text-teal-400 rounded-full flex items-center justify-center mb-2.5 transition">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Analytics</span>
          </button>
        </div>
      </div>

      {/* 3. ROW: RECENT ORDERS & DELIVERY TRACKER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Widget */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Recent Orders</h3>
              <button 
                onClick={() => setActiveTab('Orders')}
                className="text-xs font-bold text-[#2E7D32] dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 px-1 rounded-xl transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                    src={o.productImage} 
                    alt={o.productName} 
                    className="w-11 h-11 rounded-lg object-cover shrink-0 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-950 dark:text-white truncate">{o.productName}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      Buyer: <span className="font-bold text-slate-600 dark:text-slate-300">{o.buyerName}</span> • {o.orderDate}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-slate-900 dark:text-white font-mono">MWK {o.price.toLocaleString()}</p>
                  <div className="mt-1">{getStatusBadge(o.status)}</div>
                </div>
              </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Tracker Widget */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Delivery Tracker</h3>
              <button 
                onClick={() => setActiveTab('Deliveries')}
                className="text-xs font-bold text-[#2E7D32] dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-4">
              {deliveries.slice(0, 3).map((d) => {
                // Nodes checks for visual progress bar
                let activeNodesCount = 1;
                if (d.status === 'Preparing Order') activeNodesCount = 2;
                if (d.status === 'Ready for Pickup') activeNodesCount = 3;
                if (d.status === 'Out for Delivery') activeNodesCount = 3; // outbound
                if (d.status === 'Delivered' || d.status === 'Completed') activeNodesCount = 4;

                return (
                  <div key={d.id} className="bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 p-3.5 rounded-xl space-y-3 hover:shadow-xs transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">#{d.id} • {d.buyerName}</h4>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{d.deliveryLocation}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getDeliveryBadge(d.status)}
                        <a 
                          href={`tel:${d.buyerContact}`}
                          className="p-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Progress Nodes */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-1 text-[8.5px] font-bold text-slate-400 dark:text-slate-500">
                        <span className={activeNodesCount >= 1 ? "text-[#2E7D32] dark:text-emerald-400" : ""}>Confirmed</span>
                        <span className={activeNodesCount >= 2 ? "text-blue-600 dark:text-blue-400" : ""}>Preparing</span>
                        <span className={activeNodesCount >= 3 ? "text-purple-600 dark:text-purple-400" : ""}>Outbound</span>
                        <span className={activeNodesCount >= 4 ? "text-green-600 dark:text-emerald-400" : ""}>Arrived</span>
                      </div>
                      <div className="relative flex items-center justify-between">
                        {/* Connecting Line background */}
                        <div className="absolute top-1.5 left-1 right-1 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />
                        {/* Dynamic Active Line */}
                        <div 
                          className="absolute top-1.5 left-1 h-0.5 bg-emerald-600 dark:bg-emerald-500 -z-0 transition-all duration-500" 
                          style={{ width: `${((activeNodesCount - 1) / 3) * 100}%` }}
                        />
                        {/* Nodes */}
                        {[1, 2, 3, 4].map((nodeIdx) => {
                          const isActive = activeNodesCount >= nodeIdx;
                          const isSuccess = activeNodesCount > nodeIdx || activeNodesCount === 4;
                          return (
                            <div 
                              key={nodeIdx} 
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                                isActive 
                                  ? isSuccess 
                                    ? "bg-[#2E7D32] text-white scale-110" 
                                    : "bg-blue-600 text-white animate-pulse" 
                                  : "bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700"
                              }`}
                            >
                              {isActive && isSuccess && <span className="text-[7px]">✓</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. ROW: PRODUCT PERFORMANCE & RECENT MESSAGES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Performance Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Product Performance</h3>
              <button 
                onClick={() => setActiveTab('Products')}
                className="text-xs font-bold text-[#2E7D32] dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {products.slice(0, 4).map((p) => (
                <div key={p.id} className="flex gap-3 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 p-2.5 rounded-xl hover:shadow-xs transition relative group">
                  <img 
                    src={p.images[0]} 
                    alt={p.name} 
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-950 shrink-0"
                  />
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{p.name}</p>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-[11px] font-black text-slate-800 dark:text-slate-200">MWK {p.price.toLocaleString()}</span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/45 px-1.5 py-0.2 rounded font-mono shrink-0">
                        {p.salesCount} sold
                      </span>
                    </div>
                  </div>
                  <button className="absolute top-1.5 right-1.5 p-1 text-slate-400 hover:text-slate-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Messages Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Recent Messages</h3>
              <button 
                onClick={() => setActiveTab('Messages')}
                className="text-xs font-bold text-[#2E7D32] dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {chats.slice(0, 4).map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => setActiveTab('Messages')}
                  className={`p-3 flex items-center justify-between gap-3 rounded-xl border border-slate-100 dark:border-slate-800/60 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/30 ${
                    c.unreadCount > 0 ? "bg-emerald-50/30 dark:bg-emerald-950/25 border-emerald-100 dark:border-emerald-900/45" : "bg-white dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <img 
                        src={c.buyerAvatar} 
                        alt={c.buyerName} 
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      {c.unreadCount > 0 && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#2E7D32] border-2 border-white dark:border-slate-900 rounded-full" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{c.buyerName}</h4>
                      <p className={`text-[11px] truncate mt-0.5 ${c.unreadCount > 0 ? "font-bold text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`}>
                        {c.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-mono">{c.timestamp}</span>
                    {c.unreadCount > 0 && (
                      <span className="inline-block bg-[#2E7D32] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full font-mono shrink-0">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. ANALYTICS OVERVIEW CHART SECTION */}
      <div id="analytics-overview" className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex justify-between items-center mb-5">
          <div className="space-y-0.5">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Analytics Overview</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Track and optimize your seller performance</p>
          </div>
          <select className="text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 cursor-pointer">
            <option>This Week</option>
            <option>This Month</option>
            <option>Last 3 Months</option>
          </select>
        </div>

        {/* Sparkline Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Orders Sparkline */}
          <div className="bg-slate-50/50 dark:bg-slate-950/45 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between h-28 hover:shadow-xs transition">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Orders</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-slate-900 dark:text-white">32</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">▲ 12%</span>
              </div>
            </div>
            {/* Simple sparkline SVG */}
            <div className="h-8 mt-2">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0,25 Q15,10 30,20 T60,5 T90,12 T100,2" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Sales Sparkline */}
          <div className="bg-slate-50/50 dark:bg-slate-950/45 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between h-28 hover:shadow-xs transition">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Sales</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-slate-900 dark:text-white">MWK 120,000</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">▲ 15%</span>
              </div>
            </div>
            {/* Simple sparkline SVG */}
            <div className="h-8 mt-2">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0,28 Q15,18 30,25 T60,10 T90,5 T100,8" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Visitors Sparkline */}
          <div className="bg-slate-50/50 dark:bg-slate-950/45 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between h-28 hover:shadow-xs transition">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Visitors</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-slate-900 dark:text-white">1,250</span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold">▲ 9%</span>
              </div>
            </div>
            {/* Simple sparkline SVG */}
            <div className="h-8 mt-2">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0,22 Q15,12 30,15 T60,8 T90,14 T100,3" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Conversion Rate Sparkline */}
          <div className="bg-slate-50/50 dark:bg-slate-950/45 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between h-28 hover:shadow-xs transition">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Conversion Rate</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-slate-900 dark:text-white">8.6%</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold">▲ 5%</span>
              </div>
            </div>
            {/* Simple sparkline SVG */}
            <div className="h-8 mt-2">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0,25 Q15,20 30,22 T60,15 T90,18 T100,10" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 6. BOTTOM ROW: ACTIVE PROMOTION & TIPS FOR YOU */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Promotion Banner */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Active Promotion</h3>
              <span className="bg-emerald-100 dark:bg-emerald-950/50 text-[#2E7D32] dark:text-emerald-400 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider">
                Active
              </span>
            </div>

            {/* Banner details */}
            <div className="bg-red-50/30 dark:bg-red-950/15 border border-red-100/50 dark:border-red-900/30 p-4 rounded-xl flex gap-3.5 items-center mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">10% OFF All Sandwiches</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Valid until Jul 05, 2026</p>
              </div>
            </div>

            {/* Table metrics */}
            <div className="grid grid-cols-4 gap-2 text-center py-2.5 bg-slate-50/50 dark:bg-slate-950/45 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Views</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">532</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Clicks</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">74</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Orders</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">18</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Sales</span>
                <span className="text-[11px] font-black text-[#2E7D32] dark:text-emerald-400 font-mono">MWK 36,000</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-semibold font-mono">7 days left</span>
            <button 
              onClick={() => setIsCreatePromotionOpen(true)}
              className="text-xs font-black text-[#2E7D32] dark:text-emerald-400 hover:underline"
            >
              Edit Promotion
            </button>
          </div>
        </div>

        {/* Tips For You Widget */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white mb-4">Tips for you</h3>

            <div className="space-y-4">
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl shrink-0 mt-0.5">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Update your shop cover</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Shops with custom cover photos get <span className="font-bold text-[#2E7D32] dark:text-emerald-400">60% more visits</span>. Stand out on the campus feed!
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl shrink-0 mt-0.5">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Add more products</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    More products mean more catalog matches. Add at least <span className="font-bold text-slate-800 dark:text-slate-200">5 products</span> to maximize sales probability.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Respond to messages faster</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Fast response build high seller trust. Most student purchases happen within <span className="font-bold text-slate-800 dark:text-slate-200">10 mins</span> of messaging.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button className="text-xs font-black text-[#2E7D32] dark:text-emerald-400 hover:underline cursor-pointer">
              View all tips
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
