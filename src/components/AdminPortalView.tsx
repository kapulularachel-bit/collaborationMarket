import React, { useState } from 'react';
import {
  Users,
  Layers,
  ShoppingBag,
  LayoutDashboard,
  ShieldCheck,
  Settings,
  Plus,
  Trash2,
  XCircle,
  ArrowUp,
  ArrowDown,
  Store,
  Search,
  ChevronRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import { User, Shop, Product, Order, BillboardCampaign } from '../types';

interface AdminPortalViewProps {
  users: User[];
  shops: Shop[];
  products: Product[];
  orders: Order[];
  billboards: BillboardCampaign[];
  onAddBillboard: (campaign: Omit<BillboardCampaign, 'id' | 'orderIndex' | 'isActive'>) => void;
  onReorderBillboard: (index: number, direction: 'up' | 'down') => void;
  onDeleteBillboard: (id: string) => void;
  onToggleBillboardActive: (id: string) => void;
}

export default function AdminPortalView({
  users,
  shops,
  products,
  orders,
  billboards,
  onAddBillboard,
  onReorderBillboard,
  onDeleteBillboard,
  onToggleBillboardActive
}: AdminPortalViewProps) {
  // Sidebar navigation state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'shops' | 'products' | 'orders' | 'billboard'>('dashboard');

  // Search & filter states
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [shopSearchQuery, setShopSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  const userQuery = userSearchQuery.toLowerCase();
  const shopQuery = shopSearchQuery.toLowerCase();
  const productQuery = productSearchQuery.toLowerCase();
  const orderQuery = orderSearchQuery.toLowerCase();

  // Billboard form state
  const [isNewBillboardOpen, setIsNewBillboardOpen] = useState(false);
  const [bbTitle, setBbTitle] = useState('Campus Deal');
  const [bbHeadline, setBbHeadline] = useState('');
  const [bbDescription, setBbDescription] = useState('');
  const [bbImageUrl, setBbImageUrl] = useState('');
  const [bbCtaText, setBbCtaText] = useState('Explore Now');
  const [bbDestLink, setBbDestLink] = useState('product:p1');
  const [bbType, setBbType] = useState<BillboardCampaign['contentType']>('Featured Product');
  const [bbStartDate, setBbStartDate] = useState('2026-06-29');
  const [bbEndDate, setBbEndDate] = useState('2026-07-06');

  // Calculate high-level metrics
  const totalSellersCount = users.filter(u => u.isSeller).length;
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.price * o.quantity), 0);

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Activity stream
  const [activities, setActivities] = useState([
    { id: 'a1', type: 'registration', text: 'New student Aliko Phiri registered from MUST', time: '10 mins ago', badge: 'User' },
    { id: 'a2', type: 'order', text: 'Order ORD-8432 placed by Aliko Phiri for Chambo Fish', time: '45 mins ago', badge: 'Order' },
    { id: 'a3', type: 'shop', text: 'Brenda Chimwemwe updated shop "Campus Bites" logo', time: '2 hours ago', badge: 'Shop' },
    { id: 'a4', type: 'promotion', text: 'Limbani Gondwe launched 15% OFF Discount Campaign', time: '1 day ago', badge: 'Promo' },
    { id: 'a5', type: 'report', text: 'Reported product review resolved: Casio Calculator fx-991EX', time: '2 days ago', badge: 'Security' }
  ]);

  const handleBillboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bbHeadline || !bbDescription) return;

    // Fallback beautiful images if none provided
    const imgUrl = bbImageUrl || (
      bbType === 'Featured Shop' ? 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600' :
      bbType === 'Campus Deals' ? 'https://images.unsplash.com/photo-1609592424109-dd089274242e?auto=format&fit=crop&q=80&w=600' :
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=600'
    );

    onAddBillboard({
      title: bbTitle,
      headline: bbHeadline,
      description: bbDescription,
      imageUrl: imgUrl,
      ctaText: bbCtaText,
      destinationLink: bbDestLink,
      contentType: bbType,
      startDate: bbStartDate,
      endDate: bbEndDate
    });

    // Reset Form
    setBbHeadline('');
    setBbDescription('');
    setBbImageUrl('');
    setBbCtaText('Explore Now');
    setBbDestLink('product:p1');
    setBbType('Featured Product');
    setBbStartDate('2026-06-29');
    setBbEndDate('2026-07-06');
    setIsNewBillboardOpen(false);

    // Append to live activity feed
    setActivities(prev => [
      {
        id: 'ab' + Date.now(),
        type: 'billboard',
        text: `Created billboard campaign: "${bbHeadline}"`,
        time: 'Just now',
        badge: 'Billboard'
      },
      ...prev
    ]);
  };

  return (
    
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl min-h-[768px]">
      
      {/* ==================================
          SIDEBAR NAVIGATION (SaaS style)
         ================================== */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col p-6 flex-shrink-0">
        
        {/* Logo Header */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-800">
          <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-emerald-900/30">
            G
          </div>
          <div>
            <span className="text-white font-black tracking-tight text-base block">GULA Admin</span>
            <span className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase block">HQ PORTAL • 2026</span>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Main Controls</div>
            <nav className="flex flex-col gap-1">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview Dashboard</span>
              </button>

              <button 
                onClick={() => setActiveTab('billboard')}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'billboard' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>GULA Billboard ({billboards.length})</span>
              </button>
            </nav>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Marketplace Data</div>
            <nav className="flex flex-col gap-1">
              <button 
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <Users className="w-4 h-4" />
                <span>Registered Students ({users.length})</span>
              </button>

              <button 
                onClick={() => setActiveTab('shops')}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'shops' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <Store className="w-4 h-4" />
                <span>Student Shops ({shops.length})</span>
              </button>

              <button 
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <Layers className="w-4 h-4" />
                <span>Total Listings ({products.length})</span>
              </button>

              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Campus Orders ({orders.length})</span>
              </button>
            </nav>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Settings & Security</div>
            <nav className="flex flex-col gap-1">
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <ShieldCheck className="w-4 h-4" />
                <span>Audit & Permissions</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Platform Settings</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
          <p>Malawi Hub Container</p>
          <p className="text-emerald-500 mt-1">● Connection Secure</p>
        </div>
      </aside>

      {/* ==================================
          MAIN CONTENT WORKSPACE
         ================================== */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
        
        {/* Top Header Row */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {activeTab === 'dashboard' ? 'Overview' : activeTab} Panel
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Global Network: Blantyre (MUBAS) & Thyolo (MUST)</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">Server Live: 100% Uptime</span>
            </div>
            <div className="h-8 w-8 bg-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Inner Content Area */}
        <div className="flex-1 p-8 overflow-y-auto space-y-6">

          {/* ==================================
              MAIN DASHBOARD VIEW
             ================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Title Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">GULA Ecosystem Administration</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Real-time supervision of product flow, student accounts, and billboard marketing.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveTab('billboard')}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Create Billboard Campaign
                  </button>
                </div>
              </div>

              {/* Overview Analytics Cards */}
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Users</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">{users.length}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">+12%</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">MUBAS & MUST</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Active Sellers</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">{totalSellersCount}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">New this week</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Verified shops</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Products</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">{products.length}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Active</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Total listings</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Orders</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">{orders.length}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">+4 new</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Purchase requests</span>
                </div>

                <div className="bg-[#2E7D32] p-5 rounded-2xl shadow-xs flex flex-col justify-between text-white border-none">
                  <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider">GULA GMV</span>
                  <div className="mt-2">
                    <span className="text-lg font-black block tracking-tight">MWK {totalRevenue.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 mt-1">Excludes cancelled</span>
                </div>
              </div>

              {/* Graphic charts & Activity Split */}
              <div className="grid grid-cols-3 gap-6">
                
                {/* Sales Analytics Chart Block */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 col-span-2 flex flex-col justify-between h-[340px]">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Weekly GULA Sales Volume Trend</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Gross volume metrics over campuses (in thousands MWK)</p>
                      </div>
                      <span className="text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 font-bold px-2.5 py-1 rounded-lg">MWK (K)</span>
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div className="h-44 w-full relative mt-4">
                    <svg className="w-full h-full" viewBox="0 0 500 150">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.3"></stop>
                          <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.01"></stop>
                        </linearGradient>
                      </defs>
                      
                      {/* Grid Lines */}
                      <line x1="0" y1="30" x2="500" y2="30" stroke="currentColor" className="text-slate-100 dark:text-slate-800/50" strokeWidth="1" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke="currentColor" className="text-slate-100 dark:text-slate-800/50" strokeWidth="1" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="currentColor" className="text-slate-100 dark:text-slate-800/50" strokeWidth="1" />

                      {/* Area under curve */}
                      <path 
                        d="M 10 130 Q 80 110 150 70 T 300 40 T 450 15 L 450 140 L 10 140 Z" 
                        fill="url(#chartGrad)" 
                      />

                      {/* Spark line */}
                      <path 
                        d="M 10 130 Q 80 110 150 70 T 300 40 T 450 15" 
                        fill="none" 
                        stroke="#2E7D32" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                      />

                      {/* Hotspots */}
                      <circle cx="150" cy="70" r="5" fill="#2E7D32" stroke="#fff" strokeWidth="2" />
                      <circle cx="300" cy="40" r="5" fill="#2E7D32" stroke="#fff" strokeWidth="2" />
                      <circle cx="450" cy="15" r="5" fill="#2E7D32" stroke="#fff" strokeWidth="2" />

                      {/* Text tags */}
                      <text x="150" y="55" fontSize="10" fontWeight="bold" className="fill-slate-700 dark:fill-slate-300" textAnchor="middle">MWK 45K</text>
                      <text x="300" y="25" fontSize="10" fontWeight="bold" className="fill-slate-700 dark:fill-slate-300" textAnchor="middle">MWK 80K</text>
                      <text x="440" y="32" fontSize="10" fontWeight="bold" className="fill-[#2E7D32] dark:fill-emerald-400" textAnchor="end">Peak: MWK 112K</text>
                    </svg>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span>Monday</span>
                    <span>Wednesday</span>
                    <span>Friday</span>
                    <span>Sunday (Today)</span>
                  </div>
                </div>

                {/* Status Distribution Panel */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between h-[340px]">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Order Status Fulfillment</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Live breakdown of student requests</p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { status: 'Completed', color: 'bg-green-600', count: statusCounts['Completed'] || 1 },
                      { status: 'Preparing', color: 'bg-purple-600', count: statusCounts['Preparing'] || 1 },
                      { status: 'Ready for Delivery', color: 'bg-cyan-500', count: statusCounts['Ready for Delivery'] || 1 },
                      { status: 'Pending', color: 'bg-amber-500', count: statusCounts['Pending'] || 1 },
                      { status: 'Cancelled', color: 'bg-rose-500', count: statusCounts['Cancelled'] || 0 }
                    ].map((st, idx) => {
                      const total = orders.length || 1;
                      const percentage = Math.round((st.count / total) * 100);
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-700 dark:text-slate-300">{st.status}</span>
                            <span className="text-slate-500 dark:text-slate-400">{st.count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${st.color}`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-2 text-center border-t border-slate-100 dark:border-slate-800">
                    Fulfillment Rate is <strong className="text-emerald-700 dark:text-emerald-400">92.4%</strong> this month
                  </div>
                </div>

              </div>

              {/* Bottom activity Split: Recent activity vs Active Shops list */}
              <div className="grid grid-cols-3 gap-6">
                
                {/* Activity Feed */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 col-span-2">
                  <h3 className="font-extrabold text-slate-950 dark:text-white text-base mb-4 flex items-center gap-1.5">
                    <span>Recent Administrative Activities</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  </h3>

                  <div className="space-y-4">
                    {activities.map((act) => (
                      <div key={act.id} className="flex gap-4 items-start pb-4 border-b border-slate-100 dark:border-slate-800 last:border-none last:pb-0">
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold px-2.5 py-1 rounded-lg">
                          {act.badge}
                        </span>
                        <div className="flex-1">
                          <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">{act.text}</p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">{act.time}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hot Student Shops (High rating / High sales) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5">
                  <h3 className="font-extrabold text-slate-950 dark:text-white text-base mb-4">Active Campus Shops</h3>
                  <div className="space-y-4.5">
                    {shops.map((s) => (
                      <div key={s.id} className="flex items-center gap-3">
                        <img src={s.logo} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-100 dark:border-slate-800" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{s.name}</h4>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{s.university} • {s.location}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold block text-slate-900 dark:text-slate-100">⭐ {s.rating}</span>
                          <span className="text-[9px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">Verified</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================================
              BILLBOARD MANAGEMENT SECTION (CRITICAL REQUIREMENT)
             ================================== */}
          {activeTab === 'billboard' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">GULA Home Billboard Campaigns</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                    Design and order promotional banner placements featured prominently on the mobile app home screen.
                  </p>
                </div>
                <button 
                  onClick={() => setIsNewBillboardOpen(true)}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Campaign Card
                </button>
              </div>

              {/* Create/Edit Modal */}
              {isNewBillboardOpen && (
                <div className="bg-white dark:bg-slate-900 border border-emerald-600 dark:border-emerald-800 rounded-2xl p-6 shadow-xl space-y-4 max-w-2xl animate-in slide-in-from-top-2 duration-300">
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold">
                      <Sparkles className="w-5 h-5" />
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Draft New Billboard Banner</h3>
                    </div>
                    <button onClick={() => setIsNewBillboardOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 cursor-pointer">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleBillboardSubmit} className="grid grid-cols-2 gap-4 text-xs text-slate-700 dark:text-slate-200">
                    <div className="space-y-3">
                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider text-[10px]">Campaign Headline *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Free delivery on all textbooks!" 
                          value={bbHeadline}
                          onChange={(e) => setBbHeadline(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider text-[10px]">Short Description *</label>
                        <textarea 
                          required
                          rows={3}
                          placeholder="e.g. Order before Thursday from authorized student bookstores to win free pens." 
                          value={bbDescription}
                          onChange={(e) => setBbDescription(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider text-[10px]">Campaign Type</label>
                          <select 
                            value={bbType}
                            onChange={(e) => setBbType(e.target.value as BillboardCampaign['contentType'])}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-[11px]"
                          >
                            <option value="Featured Shop">Featured Shop</option>
                            <option value="Featured Product">Featured Product</option>
                            <option value="Campus Deals">Campus Deals</option>
                            <option value="Limited-Time Promotion">Limited-Time Promotion</option>
                            <option value="University Announcement">University Announcement</option>
                            <option value="Seasonal Campaign">Seasonal Campaign</option>
                            <option value="Important GULA Notice">Important GULA Notice</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider text-[10px]">Tag Label</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Hot Deal" 
                            value={bbTitle}
                            onChange={(e) => setBbTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider text-[10px]">Promo Banner Image Link</label>
                        <input 
                          type="text" 
                          placeholder="Paste Unsplash address or leave blank for preset" 
                          value={bbImageUrl}
                          onChange={(e) => setBbImageUrl(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider text-[10px]">Button Label</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Shop Now" 
                            value={bbCtaText}
                            onChange={(e) => setBbCtaText(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider text-[10px]">Destination Link</label>
                          <input 
                            type="text" 
                            placeholder="e.g. shop:s1 or product:p2" 
                            value={bbDestLink}
                            onChange={(e) => setBbDestLink(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider text-[10px]">Start Date</label>
                          <input 
                            type="date" 
                            value={bbStartDate}
                            onChange={(e) => setBbStartDate(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-[11px]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider text-[10px]">End Date</label>
                          <input 
                            type="date" 
                            value={bbEndDate}
                            onChange={(e) => setBbEndDate(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-[11px]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2 justify-end">
                      <button 
                        type="button" 
                        onClick={() => setIsNewBillboardOpen(false)}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer"
                      >
                        Publish to Billboard
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Drag-and-drop Reordering list representation */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Campaign Order index</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Order from Top to Bottom as displayed in the student client. Click arrows to raise or lower priority.</p>
                  </div>
                  <span className="text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 font-bold px-2.5 py-1 rounded-lg">
                    {billboards.length} Active Campaigns
                  </span>
                </div>

                <div className="space-y-3">
                  {billboards.map((b, index) => (
                    <div 
                      key={b.id} 
                      className={`p-4 rounded-2xl border ${b.isActive ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs' : 'border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/50 opacity-60'} flex gap-4 items-center justify-between transition-all`}
                    >
                      {/* Left: Reorder Arrows & Index */}
                      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                        <button 
                          onClick={() => onReorderBillboard(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-20 disabled:hover:bg-slate-50 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                          #{index + 1}
                        </span>
                        <button 
                          onClick={() => onReorderBillboard(index, 'down')}
                          disabled={index === billboards.length - 1}
                          className="p-1 rounded bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-20 disabled:hover:bg-slate-50 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Campaign Image preview */}
                      <img 
                        src={b.imageUrl} 
                        alt="" 
                        className="w-24 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 flex-shrink-0" 
                      />

                      {/* Metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold px-2 py-0.5 rounded">
                            {b.contentType}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Link: {b.destinationLink}</span>
                        </div>
                        <h4 className="text-sm font-black text-slate-950 dark:text-white truncate">{b.headline}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[400px]">{b.description}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1">Validity: {b.startDate} to {b.endDate}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Status</span>
                          <button 
                            onClick={() => onToggleBillboardActive(b.id)}
                            className={`text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer ${b.isActive ? 'bg-emerald-50 dark:bg-emerald-950/45 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/45' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
                          >
                            {b.isActive ? 'Active' : 'Paused'}
                          </button>
                        </div>

                        <button 
                          onClick={() => onDeleteBillboard(b.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                          title="Delete Campaign"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Creative Billboard Spec Outline Card */}
              <div className="bg-emerald-900 dark:bg-emerald-950/80 text-emerald-50 p-6 rounded-2xl shadow-sm space-y-2">
                <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-white">
                  <Store className="w-4 h-4 text-emerald-300" />
                  <span>Interactive Live Link Info</span>
                </h3>
                <p className="text-xs text-emerald-100 leading-relaxed max-w-4xl">
                  Changes made here instantly configure the GULA Home Billboard data array. If you mark a campaign as active or swap its index, the live application adapts the order instantly. Try creating a campaign for MUBAS meals to see it!
                </p>
              </div>

            </div>
          )}

          {/* ==================================
              REGISTERED STUDENTS DIRECTORY VIEW
             ================================== */}
          {activeTab === 'users' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Registered Student Accounts</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Campus directory for GULA users at MUBAS & MUST</p>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search students..." 
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-xs focus:ring-1 focus:ring-emerald-700 w-64 focus:outline-none"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
                      <th className="p-4">Student Name</th>
                      <th className="p-4">University</th>
                      <th className="p-4">Residence/Hostel</th>
                      <th className="p-4">Contact Info</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4">Role Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(u => u.name.toLowerCase().includes(userQuery) || u.email.toLowerCase().includes(userQuery))
                      .map((u) => (
                        <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800/60 last:border-none hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="p-4 flex items-center gap-3">
                            <img src={u.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{u.email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">
                              {u.university}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{u.residence}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{u.contact}</td>
                          <td className="p-4 text-slate-500 dark:text-slate-400 font-mono">{u.registrationDate}</td>
                          <td className="p-4">
                            <span className={`inline-block font-bold text-[10px] px-2 py-0.5 rounded-full ${u.isSeller ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                              {u.isSeller ? 'Seller Account' : 'Buyer'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================
              STUDENT SHOPS VIEW
             ================================== */}
          {activeTab === 'shops' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Active Student Businesses</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Verified active storefronts on campus hubs</p>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search shops..." 
                    value={shopSearchQuery}
                    onChange={(e) => setShopSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-xs focus:ring-1 focus:ring-emerald-700 w-64 focus:outline-none"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {shops
                  .filter(s => s.name.toLowerCase().includes(shopQuery))
                  .map((s) => (
                    <div key={s.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col">
                      <div className="h-28 bg-slate-100 dark:bg-slate-800 relative">
                        <img src={s.coverImage} alt="" className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-emerald-800 dark:bg-emerald-950 text-white text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-700">
                          {s.university} Hub
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="flex gap-3 items-center">
                          <img src={s.logo} alt="" className="w-10 h-10 rounded-xl object-cover border border-white dark:border-slate-800 -mt-8 shadow-md" />
                          <div>
                            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{s.name}</h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                              <MapPin className="w-3 h-3" /> {s.location}
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{s.description}</p>
                        
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px]">
                          <span className="font-bold text-slate-700 dark:text-slate-300">⭐ {s.rating} Score Rating</span>
                          <span className="text-emerald-800 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-sm uppercase tracking-wider text-[9px]">
                            ACTIVE SHOP
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ==================================
              TOTAL MARKETPLACE LISTINGS VIEW
             ================================== */}
          {activeTab === 'products' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Platform Master Listings</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Product directory audited by campus safety policies</p>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-xs focus:ring-1 focus:ring-emerald-700 w-64 focus:outline-none"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
                      <th className="p-4">Product Details</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price (MWK)</th>
                      <th className="p-4">In-Stock</th>
                      <th className="p-4">Condition</th>
                      <th className="p-4">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(p => p.name.toLowerCase().includes(productQuery))
                      .map((p) => (
                        <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800/60 last:border-none hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="p-4 flex items-center gap-3">
                            <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-50 dark:bg-slate-800" />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1">{p.description}</p>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{p.category}</td>
                          <td className="p-4 font-bold text-slate-950 dark:text-white">MWK {p.price.toLocaleString()}</td>
                          <td className="p-4 font-mono font-medium text-slate-700 dark:text-slate-300">{p.stock} units</td>
                          <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{p.condition}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              <span className="text-emerald-800 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded text-[10px]">
                                Approved
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================
              CAMPUS ORDERS DATABASE VIEW
             ================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Order Logs & Dispatch</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Central system monitoring for campus transactions</p>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search order IDs..." 
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-xs focus:ring-1 focus:ring-emerald-700 w-64 focus:outline-none"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Buyer name</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Value</th>
                      <th className="p-4">Fulfillment State</th>
                      <th className="p-4">Campus Dispatch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(o => o.id.toLowerCase().includes(orderQuery) || o.productName.toLowerCase().includes(orderQuery))
                      .map((o) => (
                        <tr key={o.id} className="border-b border-slate-100 dark:border-slate-800/60 last:border-none hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{o.id}</td>
                          <td className="p-4 text-slate-500 dark:text-slate-400">{o.orderDate}</td>
                          <td className="p-4 font-bold text-slate-800 dark:text-white">{o.buyerName}</td>
                          <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{o.productName}</td>
                          <td className="p-4 font-black text-slate-950 dark:text-white">MWK {(o.price * o.quantity).toLocaleString()}</td>
                          <td className="p-4">
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full font-bold">
                              {o.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 px-2.5 py-0.5 rounded font-extrabold text-[9px] uppercase">
                              {o.university} Hub
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
