import React, { useState } from 'react';
import { Settings, Shield, Bell, Truck, ToggleLeft, ToggleRight, Radio } from 'lucide-react';

export default function SettingsView() {
  const [shopOpen, setShopOpen] = useState(true);
  const [soundNotify, setSoundNotify] = useState(true);
  const [emailNotify, setEmailNotify] = useState(false);
  const [courierDispatch, setCourierDispatch] = useState(true);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-xs">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#2E7D32]" />
          Store Preferences & Settings
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Configure active configurations, sound alerts, courier assignments, and notification lists</p>
      </div>

      <div className="space-y-6">
        {/* Shop operational status toggle */}
        <div className="bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 p-4.5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1 pr-4">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Radio className={`w-4.5 h-4.5 ${shopOpen ? "text-[#2E7D32] animate-pulse" : "text-slate-400"}`} />
              Accepting Campus Orders
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal max-w-[380px]">
              When enabled, your menu items are visible and students can place instant orders. When disabled, your store appears as "Closed" on the client app.
            </p>
          </div>

          <button
            onClick={() => {
              setShopOpen(!shopOpen);
              alert(shopOpen ? "Your campus shop is now CLOSED to new orders." : "Your campus shop is now LIVE and accepting orders!");
            }}
            className="shrink-0 transition active:scale-95 cursor-pointer"
          >
            {shopOpen ? (
              <ToggleRight className="w-12 h-12 text-[#2E7D32]" />
            ) : (
              <ToggleLeft className="w-12 h-12 text-slate-400" />
            )}
          </button>
        </div>

        {/* Setting Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notifications config */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 space-y-4">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Bell className="w-4 h-4 text-purple-600" /> Notifications & Sound Alerts
            </h4>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">New Order Audio Ping</h5>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Play sound chimes when a student places a purchase</p>
                </div>
                <button onClick={() => setSoundNotify(!soundNotify)} className="cursor-pointer">
                  {soundNotify ? <ToggleRight className="w-10 h-10 text-[#2E7D32]" /> : <ToggleLeft className="w-10 h-10 text-slate-400" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">Push Notifications</h5>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Receive browser desktop notifications in background</p>
                </div>
                <button onClick={() => setEmailNotify(!emailNotify)} className="cursor-pointer">
                  {emailNotify ? <ToggleRight className="w-10 h-10 text-[#2E7D32]" /> : <ToggleLeft className="w-10 h-10 text-slate-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* Logistics & Security */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 space-y-4">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Truck className="w-4 h-4 text-blue-600" /> Logistics & Courier Dispatch
            </h4>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">Auto-Assign Courier Run</h5>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Auto-delegate ready orders to verified student runners</p>
                </div>
                <button onClick={() => setCourierDispatch(!courierDispatch)} className="cursor-pointer">
                  {courierDispatch ? <ToggleRight className="w-10 h-10 text-[#2E7D32]" /> : <ToggleLeft className="w-10 h-10 text-slate-400" />}
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <h5 className="font-extrabold text-[#2E7D32] flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> GULA Trust Level
                  </h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Your store is fully verified with premium merchant status.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            onClick={() => alert("Settings configuration saved successfully!")}
            className="bg-[#2E7D32] hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
          >
            Save Settings Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
