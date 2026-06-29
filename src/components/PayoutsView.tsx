import React, { useState } from 'react';
import { Landmark, ArrowUpRight, CheckCircle2, DollarSign, Wallet, Phone, Loader2 } from 'lucide-react';

export default function PayoutsView() {
  const [withdrawStep, setWithdrawStep] = useState(0); // 0 = idle, 1 = form, 2 = loading, 3 = success
  const [operator, setOperator] = useState('Airtel Money');
  const [phoneNumber, setPhoneNumber] = useState('+265 888 12 34 56');
  const [amount, setAmount] = useState('50000');
  
  const [recentPayouts, setRecentPayouts] = useState([
    { id: 'TX-8291', amount: 150000, date: 'Jun 25, 2026', method: 'Airtel Money', status: 'Completed' },
    { id: 'TX-7104', amount: 120000, date: 'Jun 18, 2026', method: 'TNM Mpamba', status: 'Completed' }
  ]);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawStep(2);
    
    setTimeout(() => {
      setWithdrawStep(3);
      // add to recent
      setRecentPayouts(prev => [
        {
          id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
          amount: parseFloat(amount),
          date: 'Today',
          method: operator,
          status: 'Completed'
        },
        ...prev
      ]);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Earnings */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Total Store Revenue</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">MWK 450,000</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">Earnings since registration</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-[#2E7D32] dark:text-emerald-400 rounded-xl shrink-0">
            <Wallet className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Available Balance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Available to Withdraw</span>
            <span className="text-xl font-black text-[#2E7D32] dark:text-emerald-400">MWK 180,000</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">✓ Safe for instant release</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-[#2E7D32] dark:text-emerald-400 rounded-xl shrink-0">
            <Landmark className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-emerald-800 dark:bg-emerald-950 text-white dark:text-emerald-300 p-5 rounded-2xl flex flex-col justify-between hover:opacity-95 dark:border dark:border-emerald-800/60 transition">
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm">Instant Mobile Transfer</h4>
            <p className="text-[10px] text-emerald-100 leading-normal">Payout funds directly to your Malawian mobile wallets instantly.</p>
          </div>
          {withdrawStep === 0 && (
            <button
              onClick={() => setWithdrawStep(1)}
              className="mt-3 bg-white text-[#2E7D32] font-black py-2 rounded-xl text-center text-xs shadow hover:bg-slate-50 transition cursor-pointer flex items-center justify-center gap-1"
            >
              Withdraw Funds <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Withdrawal form panel */}
        {withdrawStep > 0 && (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Mobile Money Cash-Out
            </h3>

            {withdrawStep === 1 && (
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOperator('Airtel Money')}
                    className={`py-3.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 cursor-pointer transition ${
                      operator === 'Airtel Money'
                        ? "bg-red-50 dark:bg-red-950/30 text-red-600 border-red-200 dark:border-red-900/45"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    <span className="text-sm">🔴</span>
                    <span>Airtel Money</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOperator('TNM Mpamba')}
                    className={`py-3.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 cursor-pointer transition ${
                      operator === 'TNM Mpamba'
                        ? "bg-green-50 dark:bg-emerald-950/30 text-[#2E7D32] dark:text-emerald-400 border-[#2E7D32]/20 dark:border-emerald-900/45"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    <span className="text-sm">🟢</span>
                    <span>TNM Mpamba</span>
                  </button>
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1.5 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Wallet Phone Number (+265)
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 focus:border-[#2E7D32] rounded-xl p-3 focus:outline-none transition font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1.5">Amount to Withdraw (MWK)</label>
                  <input
                    type="number"
                    max="180000"
                    min="5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 focus:border-[#2E7D32] rounded-xl p-3 focus:outline-none transition font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 font-mono"
                    required
                  />
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Available: MWK 180,000 • Min: MWK 5,000</p>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawStep(0)}
                    className="flex-1 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#2E7D32] hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition shadow cursor-pointer"
                  >
                    Confirm Cash-out
                  </button>
                </div>
              </form>
            )}

            {withdrawStep === 2 && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#2E7D32] animate-spin" />
                <h4 className="font-bold text-slate-800 dark:text-white">Processing Mobile Money Transaction</h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[250px]">Please wait while our platform releases funds to {operator} wallet...</p>
              </div>
            )}

            {withdrawStep === 3 && (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-[#2E7D32]" />
                <h4 className="font-extrabold text-slate-900 dark:text-white font-black">Withdrawal Successful!</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[250px] leading-relaxed">
                  MWK {parseFloat(amount).toLocaleString()} has been transferred to your {operator} phone number <span className="font-bold text-slate-800 dark:text-slate-200">{phoneNumber}</span>.
                </p>
                <button
                  onClick={() => setWithdrawStep(0)}
                  className="mt-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold px-5 py-2 rounded-xl transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        )}

        {/* Recent Payouts */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            Payout & Settlement History
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentPayouts.map((p) => (
              <div key={p.id} className="py-3 flex justify-between items-center hover:bg-slate-50/40 dark:hover:bg-slate-800/30 px-1 rounded-xl transition">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white">Transfer to {p.method}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Reference: <span className="font-mono">{p.id}</span> • {p.date}</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 dark:text-white block">-MWK {p.amount.toLocaleString()}</span>
                  <span className="text-[9px] bg-green-50 dark:bg-green-950/25 text-green-800 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-green-100 dark:border-emerald-900 mt-0.5 inline-block">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
