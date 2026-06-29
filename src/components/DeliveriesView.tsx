import React from 'react';
import { Truck, Phone, Navigation, Clock, User, CheckCircle } from 'lucide-react';
import { Delivery, DeliveryStatus } from '../types';

interface DeliveriesViewProps {
  deliveries: Delivery[];
  onUpdateDeliveryStatus: (deliveryId: string, status: DeliveryStatus) => void;
}

export default function DeliveriesView({
  deliveries,
  onUpdateDeliveryStatus
}: DeliveriesViewProps) {

  const getStatusColorStyle = (status: DeliveryStatus) => {
    switch (status) {
      case 'Out for Delivery':
        return 'bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50';
      case 'Preparing Order':
        return 'bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50';
      case 'Ready for Pickup':
        return 'bg-purple-100 dark:bg-purple-950/30 text-purple-800 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50';
      case 'Delivered':
      case 'Completed':
        return 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-emerald-400 border border-green-200 dark:border-emerald-900/50';
      case 'Cancelled':
        return 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-900/50';
      default:
        return 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-800';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#2E7D32]" />
          Malawi Campus Courier Dispatch
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Track real-time courier statuses, coordinate student runners, and monitor delivery timelines</p>
      </div>

      {/* Grid of Deliveries */}
      {deliveries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliveries.map((d) => {
            let activeNodesCount = 1;
            if (d.status === 'Preparing Order') activeNodesCount = 2;
            if (d.status === 'Ready for Pickup') activeNodesCount = 3;
            if (d.status === 'Out for Delivery') activeNodesCount = 3; // outbound
            if (d.status === 'Delivered' || d.status === 'Completed') activeNodesCount = 4;

            return (
              <div key={d.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-5 hover:shadow-xs transition duration-200 bg-white dark:bg-slate-900">
                {/* Upper info */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] font-black text-slate-400 dark:text-slate-500">TRACK ID: #{d.id}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusColorStyle(d.status)}`}>
                        {d.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-950 dark:text-white flex items-center gap-1.5 mt-1">
                      <User className="w-4 h-4 text-slate-400" />
                      {d.buyerName}
                    </h3>
                    <p className="text-xs font-semibold text-[#2E7D32] dark:text-emerald-400 flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5" />
                      {d.deliveryLocation}
                    </p>
                  </div>

                  <a
                    href={`tel:${d.buyerContact}`}
                    className="p-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition"
                    title="Call student buyer"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                {/* Products description */}
                <div className="bg-slate-50/70 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100/60 dark:border-slate-800 text-xs">
                  <p className="font-bold text-slate-500 dark:text-slate-400">Listed items:</p>
                  <p className="font-black text-slate-900 dark:text-white mt-0.5">{d.products}</p>
                  {d.notes && (
                    <p className="text-[11px] text-red-500 mt-2 italic font-semibold">
                      📝 Note: {d.notes}
                    </p>
                  )}
                </div>

                {/* Visual Timeline Nodes */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between px-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    <span className={activeNodesCount >= 1 ? "text-[#2E7D32] dark:text-emerald-400" : "dark:text-slate-600"}>Confirmed</span>
                    <span className={activeNodesCount >= 2 ? "text-blue-600 dark:text-blue-400" : "dark:text-slate-600"}>Preparing</span>
                    <span className={activeNodesCount >= 3 ? "text-purple-600 dark:text-purple-400" : "dark:text-slate-600"}>Transit</span>
                    <span className={activeNodesCount >= 4 ? "text-green-600 dark:text-emerald-400" : "dark:text-slate-600"}>Arrived</span>
                  </div>
                  <div className="relative flex items-center justify-between">
                    <div className="absolute top-2 left-1 right-1 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />
                    <div 
                      className="absolute top-2 left-1 h-0.5 bg-emerald-600 -z-0 transition-all duration-500" 
                      style={{ width: `${((activeNodesCount - 1) / 3) * 100}%` }}
                    />
                    {[1, 2, 3, 4].map((nodeIdx) => {
                      const isActive = activeNodesCount >= nodeIdx;
                      const isSuccess = activeNodesCount > nodeIdx || activeNodesCount === 4;
                      return (
                        <div 
                          key={nodeIdx} 
                          className={`w-4 h-4 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                            isActive 
                              ? isSuccess 
                                ? "bg-[#2E7D32] text-white scale-110" 
                                : "bg-blue-600 text-white animate-pulse" 
                              : "bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700"
                          }`}
                        >
                          {isActive && isSuccess && <span className="text-[8px]">✓</span>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 pt-1.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Pref: {d.preferredTime}
                    </span>
                    <span className="font-mono text-[9px] font-bold">Updated: {d.updatedAt}</span>
                  </div>
                </div>

                {/* Progress control buttons */}
                <div className="flex gap-2 pt-3 border-t border-slate-100/60 dark:border-slate-800">
                  {d.status === 'Preparing Order' && (
                    <button
                      onClick={() => onUpdateDeliveryStatus(d.id, 'Ready for Pickup')}
                      className="w-full bg-[#2E7D32] hover:bg-emerald-700 text-white text-xs font-black py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" /> Ready for Pickup
                    </button>
                  )}
                  {d.status === 'Ready for Pickup' && (
                    <button
                      onClick={() => onUpdateDeliveryStatus(d.id, 'Out for Delivery')}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-black py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Truck className="w-4 h-4" /> Dispatch to Courier
                    </button>
                  )}
                  {d.status === 'Out for Delivery' && (
                    <button
                      onClick={() => onUpdateDeliveryStatus(d.id, 'Delivered')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-black py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" /> Confirm Delivered
                    </button>
                  )}
                  {d.status === 'Delivered' && (
                    <div className="w-full text-center py-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 text-xs font-bold rounded-xl border border-emerald-100 dark:border-emerald-900/35">
                      Completed & Delivered ✓
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-950/20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <Truck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No active deliveries.</p>
          <p className="text-xs text-slate-400 mt-1">Sellers dispatch active orders to student couriers. Statuses will load in here.</p>
        </div>
      )}
    </div>
  );
}
