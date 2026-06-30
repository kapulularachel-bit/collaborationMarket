import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  Check, 
  X, 
  CheckSquare, 
  Clock, 
  MessageSquare, 
  ChevronDown, 
  Calendar, 
  FileDown 
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export default function OrdersView({
  orders,
  onUpdateOrderStatus
}: OrdersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS_PER_PAGE = 10;

  // Filter orders based on inputs
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    
    const matchesPayment = 
      paymentFilter === 'All' || 
      (o.paymentStatus && o.paymentStatus === paymentFilter);

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ROWS_PER_PAGE));
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  // Reset to page 1 if filters change and current page exceeds total
  const safeCurrentPage = Math.min(currentPage, totalPages);

  // Render visual progress slider under status
  const renderStatusTracker = (status: OrderStatus) => {
    let filledDots = 0;
    let activeColor = "bg-emerald-600";
    
    switch (status) {
      case 'Pending':
        filledDots = 1;
        activeColor = "bg-amber-500";
        break;
      case 'Accepted':
      case 'Preparing':
        filledDots = 2;
        activeColor = "bg-blue-500";
        break;
      case 'Ready for Delivery':
      case 'In Delivery':
        filledDots = 3;
        activeColor = "bg-sky-500";
        break;
      case 'Delivered':
      case 'Completed':
        filledDots = 4;
        activeColor = "bg-green-500";
        break;
      case 'Cancelled':
        filledDots = 0;
        break;
    }

    return (
      <div className="flex flex-col gap-1 mt-1.5 w-24">
        <div className="relative flex items-center justify-between w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full">
          {/* Filled progress bar line */}
          <div 
            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${
              status === 'Cancelled' ? 'bg-red-500/20' : activeColor
            }`} 
            style={{ 
              width: filledDots > 1 ? `${((filledDots - 1) / 3) * 100}%` : '0%' 
            }} 
          />
          {/* Progress dots */}
          {[1, 2, 3, 4].map((step) => {
            const isFilled = step <= filledDots;
            return (
              <div 
                key={step} 
                className={`w-1.5 h-1.5 rounded-full z-10 transition-colors duration-300 ${
                  status === 'Cancelled' 
                    ? 'bg-slate-300 dark:bg-slate-700' 
                    : isFilled 
                      ? activeColor 
                      : 'bg-slate-300 dark:bg-slate-700'
                }`} 
              />
            );
          })}
        </div>
      </div>
    );
  };

  // Render product cells with stacked images when there are multiple items
  const renderProductCell = (o: Order) => {
    if (o.quantity > 1) {
      return (
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5 shrink-0 relative pr-2">
            <img
              src={o.productImage}
              alt={o.productName}
              className="w-8 h-8 rounded-lg object-cover bg-slate-100 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 z-10"
            />
            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 absolute top-0 left-4 shadow-md flex items-center justify-center">
              <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">+{o.quantity - 1}</span>
            </div>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white leading-tight">{o.productName}</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-bold">+{o.quantity - 1} more</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{o.quantity} items</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <img
          src={o.productImage}
          alt={o.productName}
          className="w-8 h-8 rounded-lg object-cover bg-slate-100 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shrink-0"
        />
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white leading-tight">{o.productName}</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">1 item</p>
        </div>
      </div>
    );
  };

  const getStatusBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100/10 text-amber-500 border border-amber-500/20';
      case 'Accepted':
        return 'bg-blue-100/10 text-blue-400 border border-blue-500/20';
      case 'Preparing':
        return 'bg-indigo-100/10 text-indigo-400 border border-indigo-500/20';
      case 'Ready for Delivery':
        return 'bg-sky-100/10 text-sky-400 border border-sky-500/20';
      case 'In Delivery':
        return 'bg-indigo-100/10 text-indigo-400 border border-indigo-500/20';
      case 'Delivered':
      case 'Completed':
        return 'bg-green-100/10 text-green-500 border border-green-500/20';
      case 'Cancelled':
        return 'bg-red-100/10 text-red-500 border border-red-500/20';
      default:
        return 'bg-slate-100/10 text-slate-400 border border-slate-500/20';
    }
  };

  const getPaymentBadgeStyle = (status?: 'PAID' | 'REFUNDED' | 'PENDING') => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100/10 text-green-500 text-[9.5px] font-black border border-green-500/20 rounded-md px-2 py-0.5';
      case 'REFUNDED':
        return 'bg-purple-100/10 text-purple-400 text-[9.5px] font-black border border-purple-500/20 rounded-md px-2 py-0.5';
      case 'PENDING':
        return 'bg-amber-100/10 text-amber-500 text-[9.5px] font-black border border-amber-500/20 rounded-md px-2 py-0.5';
      default:
        return 'bg-slate-100/10 text-slate-400 text-[9.5px] font-black border border-slate-500/20 rounded-md px-2 py-0.5';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Orders</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage incoming orders, update status, and coordinate with buyers and delivery.
          </p>
        </div>
      </div>

      {/* 2. Metrics Grid Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Metric 1: All Orders */}
        <div className="bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-green-600 dark:text-emerald-400 font-extrabold flex items-center gap-0.5">
              <span>↗</span> 22.5%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">All Orders</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1 font-mono">142</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">vs last 7 days</span>
          </div>
        </div>

        {/* Metric 2: Pending */}
        <div className="bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Pending</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1 font-mono">12</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">New orders to review</span>
          </div>
        </div>

        {/* Metric 3: Preparing */}
        <div className="bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center w-9 h-9">
              <span className="text-sm">🥘</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Preparing</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1 font-mono">8</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Being prepared</span>
          </div>
        </div>

        {/* Metric 4: Ready for Delivery */}
        <div className="bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-xl flex items-center justify-center w-9 h-9">
              <span className="text-sm">📦</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Ready for Delivery</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1 font-mono">5</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Ready to dispatch</span>
          </div>
        </div>

        {/* Metric 5: Delivered */}
        <div className="bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-50 dark:bg-emerald-950/40 text-green-600 dark:text-emerald-400 rounded-xl">
              <Check className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Delivered</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1 font-mono">98</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Completed successfully</span>
          </div>
        </div>

        {/* Metric 6: Cancelled */}
        <div className="bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl">
              <X className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Cancelled</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1 font-mono">19</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Cancelled orders</span>
          </div>
        </div>
      </div>

      {/* 3. Filters Segment */}
      <div className="flex flex-wrap items-end gap-3 bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        {/* Search */}
        <div className="flex-1 min-w-[280px]">
          <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Search</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search by order ID, product, or buyer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2E7D32] dark:focus:border-emerald-500 focus:outline-none rounded-xl transition text-slate-700 dark:text-slate-300"
            />
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="w-48">
          <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Date Range</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Select date range"
              defaultValue="Select date range"
              className="w-full text-xs pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none rounded-xl transition font-bold text-slate-700 dark:text-slate-300 cursor-default"
              readOnly
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Order Status Select */}
        <div className="w-44">
          <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Order Status</label>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none rounded-xl transition font-bold text-slate-700 dark:text-slate-300 appearance-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready for Delivery">Ready for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Payment Status Select */}
        <div className="w-40">
          <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Payment Status</label>
          <div className="relative">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full text-xs pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none rounded-xl transition font-bold text-slate-700 dark:text-slate-300 appearance-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="REFUNDED">Refunded</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Filters Trigger */}
        <button className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs font-bold rounded-xl transition cursor-pointer text-slate-700 dark:text-slate-300">
          <span className="text-slate-500 dark:text-slate-400">📊</span>
          <span>Filters</span>
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        </button>
      </div>

      {/* 4. Table Grid */}
      {filteredOrders.length > 0 ? (
        <div className="overflow-x-auto bg-white dark:bg-slate-900/20 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs">
          <table className="w-full text-left border-collapse min-w-[1000px] text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="p-4">Order</th>
                <th className="p-4">Products</th>
                <th className="p-4">Buyer</th>
                <th className="p-4">Delivery Location</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Order Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition">
                  {/* Order ID */}
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                    #{o.id}
                  </td>

                  {/* Products */}
                  <td className="p-4">
                    {renderProductCell(o)}
                  </td>

                  {/* Buyer */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={o.buyerAvatar}
                        alt={o.buyerName}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white leading-tight">{o.buyerName}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                          {o.buyerPhone || '+265 995 123 456'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Delivery Location */}
                  <td className="p-4">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-300 leading-tight">
                        {o.deliveryLocation}
                      </p>
                      <p className="text-[9.5px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                        {o.deliveryLocation.includes('Hostel') ? o.deliveryLocation.split(' ')[0] + ' Block' : 'MUBAS Campus'}
                      </p>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="p-4 font-extrabold text-slate-950 dark:text-white font-mono">
                    MWK {o.price.toLocaleString()}
                  </td>

                  {/* Status Badge + Visual Bar */}
                  <td className="p-4">
                    <div className="flex flex-col">
                      <div>
                        <span className={`inline-block text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusBadgeStyle(o.status)}`}>
                          {o.status}
                        </span>
                      </div>
                      {renderStatusTracker(o.status)}
                    </div>
                  </td>

                  {/* Payment */}
                  <td className="p-4">
                    <span className={getPaymentBadgeStyle(o.paymentStatus)}>
                      {o.paymentStatus || 'PAID'}
                    </span>
                  </td>

                  {/* Order Date */}
                  <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">
                    {o.orderDate}
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Chat Button */}
                      <button 
                        onClick={() => alert(`Starting support conversation thread with buyer ${o.buyerName}...`)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer"
                        title="Chat with buyer"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      {/* View Dropdown wrapper */}
                      <div className="relative">
                        <button
                          onClick={() => setOpenActionMenu(openActionMenu === o.id ? null : o.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 rounded-xl transition cursor-pointer shadow-3xs"
                        >
                          <span>View</span>
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>

                        {openActionMenu === o.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-1.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="px-2 py-1 border-b border-slate-100 dark:border-slate-850 mb-1">
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Change Status</span>
                            </div>
                            
                            {o.status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => { onUpdateOrderStatus(o.id, 'Accepted'); setOpenActionMenu(null); }}
                                  className="w-full text-left px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg flex items-center gap-1.5"
                                >
                                  <Check className="w-3 h-3 text-emerald-500" /> Accept Order
                                </button>
                                <button
                                  onClick={() => { onUpdateOrderStatus(o.id, 'Cancelled'); setOpenActionMenu(null); }}
                                  className="w-full text-left px-2 py-1 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg flex items-center gap-1.5"
                                >
                                  <X className="w-3 h-3" /> Decline Order
                                </button>
                              </>
                            )}

                            {o.status === 'Accepted' && (
                              <button
                                onClick={() => { onUpdateOrderStatus(o.id, 'Preparing'); setOpenActionMenu(null); }}
                                className="w-full text-left px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg flex items-center gap-1.5"
                              >
                                <Clock className="w-3.5 h-3.5 text-amber-500" /> Begin Prep
                              </button>
                            )}

                            {o.status === 'Preparing' && (
                              <button
                                onClick={() => { onUpdateOrderStatus(o.id, 'Ready for Delivery'); setOpenActionMenu(null); }}
                                className="w-full text-left px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg flex items-center gap-1.5"
                              >
                                <span>📦</span> Mark Ready
                              </button>
                            )}

                            {o.status === 'Ready for Delivery' && (
                              <button
                                onClick={() => { onUpdateOrderStatus(o.id, 'In Delivery'); setOpenActionMenu(null); }}
                                className="w-full text-left px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg flex items-center gap-1.5"
                              >
                                <span>🚚</span> Dispatch Delivery
                              </button>
                            )}

                            {o.status === 'In Delivery' && (
                              <button
                                onClick={() => { onUpdateOrderStatus(o.id, 'Delivered'); setOpenActionMenu(null); }}
                                className="w-full text-left px-2 py-1 text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg flex items-center gap-1.5"
                              >
                                <CheckSquare className="w-3.5 h-3.5" /> Confirm Delivery
                              </button>
                            )}

                            {['Delivered', 'Cancelled', 'Completed'].includes(o.status) && (
                              <span className="block px-2 py-1.5 text-[11px] text-slate-400 dark:text-slate-500 italic font-bold">
                                Order archived
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No orders found.</p>
          <p className="text-xs text-slate-400 mt-1">No incoming transactions matching your active query criteria.</p>
        </div>
      )}

      {/* 5. Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-bold">
          Showing {((safeCurrentPage - 1) * ROWS_PER_PAGE) + 1}–{Math.min(safeCurrentPage * ROWS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
        </span>

        {/* Page controllers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-xs transition cursor-pointer ${
                page === safeCurrentPage
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {page}
            </button>
          ))}
          {totalPages > 5 && (
            <>
              <span className="text-slate-400 dark:text-slate-600 px-1">...</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-xs bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={safeCurrentPage >= totalPages}
            className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-xs bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40"
          >
            &gt;
          </button>
        </div>

        {/* Rows per page select */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400">Rows per page:</span>
          <div className="relative">
            <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-2 pr-6 py-1 font-bold text-slate-700 dark:text-slate-300 cursor-pointer appearance-none">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
