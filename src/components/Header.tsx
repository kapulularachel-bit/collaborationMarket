import React, { useState } from 'react';
import { Bell, ChevronDown, MapPin, Calendar, FileDown } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  seller: User;
  university: string;
  setUniversity: (uni: string) => void;
  systemLogs: string[];
}

export default function Header({
  seller,
  university,
  setUniversity,
  systemLogs
}: HeaderProps) {
  const [showLogs, setShowLogs] = useState(false);

  return (
    <header className="bg-slate-950 text-white px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 border-b border-slate-900">
      {/* Left Area: Campus Selector */}
      <div className="flex items-center gap-1.5 text-xs">
        <div className="p-1.5 bg-emerald-950/40 text-emerald-500 rounded-lg">
          <MapPin className="w-3.5 h-3.5" />
        </div>
        <div className="relative">
          <select
            value={university}
            onChange={(e) => {
              setUniversity(e.target.value);
            }}
            className="text-[11px] font-extrabold bg-slate-900 border border-slate-800 rounded-xl pl-2.5 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200 cursor-pointer appearance-none font-sans"
          >
            <option value="MUBAS">MUBAS Campus</option>
            <option value="MUST">MUST Campus</option>
            <option value="Chancellor College">Chancellor College</option>
            <option value="Lilongwe Uni (LUANAR)">LUANAR Campus</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Right Area: Dashboard Controls */}
      <div className="flex items-center gap-3">
        {/* Date Selector */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-slate-300 font-bold">
          <span>Jun 23 – Jun 29, 2026</span>
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Comparison Selector */}
        <div className="hidden md:block relative">
          <select className="text-[11px] font-bold bg-slate-900 border border-slate-800 rounded-xl pl-3 pr-8 py-2 focus:outline-none text-slate-300 cursor-pointer appearance-none">
            <option>Compare: Previous 7 days</option>
            <option>Compare: Previous Month</option>
            <option>Compare: Static Target</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>

        {/* Export Orders Button */}
        <button 
          onClick={() => alert("Exporting 142 orders to CSV file...")}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-[11px] font-bold text-slate-300 transition cursor-pointer"
        >
          <FileDown className="w-3.5 h-3.5 text-slate-400" />
          <span>Export Orders</span>
        </button>

        {/* Bell Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition text-slate-300 cursor-pointer relative flex items-center justify-center"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-slate-950 font-mono shrink-0">
              3
            </span>
          </button>

          {/* Mini overlay logs panel */}
          {showLogs && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-lg p-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-2">
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Live System Logs</h4>
                <button 
                  onClick={() => setShowLogs(false)}
                  className="text-[10px] font-bold text-emerald-400"
                >
                  Close
                </button>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto divide-y divide-slate-900">
                {systemLogs.slice().reverse().map((log, index) => (
                  <div key={index} className="pt-2 text-[10px] text-slate-400 leading-normal flex items-start gap-1.5 font-mono">
                    <span className="text-emerald-500 shrink-0">★</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Element */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
          <div className="text-right hidden md:block">
            <span className="text-[11px] font-black text-white block">Brenda's Bites</span>
            <span className="text-[9px] text-slate-400 block -mt-0.5">Seller Account</span>
          </div>
          <div className="relative">
            <img
              src={seller.avatar}
              alt="Brenda"
              className="w-8.5 h-8.5 rounded-full object-cover border border-emerald-500"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-slate-900 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
}
