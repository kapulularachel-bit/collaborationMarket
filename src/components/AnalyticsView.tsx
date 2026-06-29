import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Activity, 
  ChevronDown, 
  Calendar, 
  ShoppingBag, 
  ShoppingCart, 
  Info, 
  ArrowUpRight, 
  FileDown, 
  Plus, 
  Search, 
  Share2,
  Megaphone,
  Lightbulb
} from 'lucide-react';

export default function AnalyticsView() {
  // --- States ---
  const [activeSubTab, setActiveSubTab] = useState<'Overview' | 'Sales' | 'Orders' | 'Products' | 'Customers' | 'Marketing'>('Overview');
  const [selectedRange, setSelectedRange] = useState<string>('Jun 23 – Jun 29, 2026');
  const [comparisonPeriod, setComparisonPeriod] = useState<string>('Previous 7 days');
  
  // Interactive interactive state for the Revenue Overview line chart
  const [hoveredRevIdx, setHoveredRevIdx] = useState<number>(3); // default to Jun 26 (matching mockup)

  // --- Mock Datasets ---
  const REVENUE_DATA = [
    { day: 'Jun 23', revenue: 38000, valueDisplay: 'MWK 38,000', label: 'Jun 23, 2026', orders: 12 },
    { day: 'Jun 24', revenue: 45000, valueDisplay: 'MWK 45,000', label: 'Jun 24, 2026', orders: 18 },
    { day: 'Jun 25', revenue: 78000, valueDisplay: 'MWK 78,000', label: 'Jun 25, 2026', orders: 15 },
    { day: 'Jun 26', revenue: 82500, valueDisplay: 'MWK 82,500', label: 'Jun 26, 2026', orders: 22 },
    { day: 'Jun 27', revenue: 120000, valueDisplay: 'MWK 120,000', label: 'Jun 27, 2026', orders: 28 },
    { day: 'Jun 28', revenue: 95000, valueDisplay: 'MWK 95,000', label: 'Jun 28, 2026', orders: 20 },
    { day: 'Jun 29', revenue: 150000, valueDisplay: 'MWK 150,000', label: 'Jun 29, 2026', orders: 27 },
  ];

  const CATEGORIES_DATA = [
    { name: 'Chicken Shawarma & Meals', amount: 180000, percentage: 40.0, color: '#2E7D32', textClass: 'text-emerald-600 dark:text-emerald-400' },
    { name: 'Beef Noodles', amount: 120000, percentage: 26.7, color: '#2563EB', textClass: 'text-blue-600 dark:text-blue-400' },
    { name: 'Grilled Sandwiches', amount: 90000, percentage: 20.0, color: '#8B5CF6', textClass: 'text-purple-600 dark:text-purple-400' },
    { name: 'Iced Coffee & Drinks', amount: 60000, percentage: 13.3, color: '#F59E0B', textClass: 'text-amber-600 dark:text-amber-400' },
  ];

  const TOP_PRODUCTS = [
    { name: 'Chicken Shawarma', sold: 45, revenue: 202500, percentageWidth: 'w-12', color: 'bg-emerald-600', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=120' },
    { name: 'Beef Noodles', sold: 32, revenue: 132000, percentageWidth: 'w-8', color: 'bg-blue-600', img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=120' },
    { name: 'Grilled Sandwich', sold: 28, revenue: 84000, percentageWidth: 'w-7', color: 'bg-purple-600', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=120' },
    { name: 'Iced Coffee', sold: 25, revenue: 30000, percentageWidth: 'w-6', color: 'bg-amber-500', img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=120' },
    { name: 'French Fries', sold: 18, revenue: 18000, percentageWidth: 'w-4', color: 'bg-yellow-500', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=120' },
  ];

  const TRAFFIC_SOURCES = [
    { source: 'GULA App (Home)', visitors: 1650, percent: 48.1, color: 'bg-emerald-600', width: 'w-[48%]' },
    { source: 'Search', visitors: 980, percent: 28.5, color: 'bg-blue-600', width: 'w-[28.5%]' },
    { source: 'Categories', visitors: 520, percent: 15.1, color: 'bg-purple-600', width: 'w-[15.1%]' },
    { source: 'Seller Profile', visitors: 210, percent: 6.1, color: 'bg-amber-500', width: 'w-[6.1%]' },
    { source: 'Other', visitors: 68, percent: 2.0, color: 'bg-slate-400', width: 'w-[2%]' },
  ];

  // Helper calculating SVG coordinate points for Revenue Overview line
  const maxRevenue = 160000;
  const chartHeight = 140;
  const chartWidth = 440;
  const startX = 35;
  const stepX = chartWidth / (REVENUE_DATA.length - 1);

  const points = REVENUE_DATA.map((item, idx) => {
    const x = startX + idx * stepX;
    const y = 160 - (item.revenue / maxRevenue) * chartHeight;
    return { x, y, ...item };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},165 L ${points[0].x},165 Z`;

  // Helper for Order Trend line coords
  const maxOrders = 40;
  const orderPoints = REVENUE_DATA.map((item, idx) => {
    const x = startX + idx * stepX;
    const y = 140 - (item.orders / maxOrders) * 110;
    return { x, y, ...item };
  });

  const orderPathD = orderPoints.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
  }, '');

  // Handle Export triggering
  const handleExport = () => {
    alert("Exporting system PDF analytical report to files... Saved as GULA_Merchant_Report_MUBAS.csv successfully!");
  };

  const handleRangeChange = () => {
    const nextRange = selectedRange.includes('Jun 23') 
      ? 'May 23 – May 29, 2026' 
      : 'Jun 23 – Jun 29, 2026';
    setSelectedRange(nextRange);
    alert(`Date range switched to: ${nextRange}`);
  };

  const handleComparisonChange = () => {
    const nextComp = comparisonPeriod.includes('Previous') ? 'Same Period Last Month' : 'Previous 7 days';
    setComparisonPeriod(nextComp);
    alert(`Comparison range set to: ${nextComp}`);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP HEADER SUMMARY DASHBOARD CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Analytics Overview</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track your store performance and make data-driven decisions.</p>
        </div>

        {/* Dynamic Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Picker Button */}
          <button 
            onClick={handleRangeChange}
            className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>{selectedRange}</span>
          </button>

          {/* Comparison Picker Dropdown */}
          <button 
            onClick={handleComparisonChange}
            className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs cursor-pointer"
          >
            <span className="text-slate-400 dark:text-slate-500 font-medium">Compare:</span>
            <span className="text-emerald-600 dark:text-emerald-400">{comparisonPeriod}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Export Report Button */}
          <button 
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-TABS NAVIGATION BAR */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex overflow-x-auto gap-6 no-scrollbar pb-px">
          {(['Overview', 'Sales', 'Orders', 'Products', 'Customers', 'Marketing'] as const).map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveSubTab(tab);
                  if (tab !== 'Overview') {
                    alert(`Loaded filtered analytical report sub-view for: ${tab}`);
                  }
                }}
                className={`py-3 text-xs font-black tracking-wide border-b-2 transition-all relative cursor-pointer shrink-0 ${
                  isActive 
                    ? "border-[#2E7D32] text-[#2E7D32] dark:text-emerald-400" 
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. KEY PERFORMANCE CARDS GRID (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Revenue KPI */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-[#2E7D32] dark:text-emerald-400 rounded-xl">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Total Revenue</span>
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">MWK 450,000</h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" />
              18.4% <span className="text-slate-400 dark:text-slate-500 font-medium font-sans">vs previous 7 days</span>
            </span>
          </div>
        </div>

        {/* Total Orders KPI */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Total Orders</span>
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">142</h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" />
              22.5% <span className="text-slate-400 dark:text-slate-500 font-medium font-sans">vs previous 7 days</span>
            </span>
          </div>
        </div>

        {/* Visitors KPI */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Visitors</span>
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">3,428</h3>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" />
              12.3% <span className="text-slate-400 dark:text-slate-500 font-medium font-sans">vs previous 7 days</span>
            </span>
          </div>
        </div>

        {/* Conversion Rate KPI */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-[#2E7D32] dark:text-emerald-400 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Conversion Rate</span>
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">8.62%</h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" />
              1.26% <span className="text-slate-400 dark:text-slate-500 font-medium font-sans">vs previous 7 days</span>
            </span>
          </div>
        </div>

        {/* Avg Order Value KPI */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Avg. Order Value</span>
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">MWK 3,169</h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" />
              8.7% <span className="text-slate-400 dark:text-slate-500 font-medium font-sans">vs previous 7 days</span>
            </span>
          </div>
        </div>
      </div>

      {/* 4. MAIN CHARTS GRID ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Revenue Overview (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex justify-between items-center pb-2">
            <div className="space-y-0.5">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                Revenue Overview
                <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600" title="Daily cumulative shop earnings in MWK" />
              </h3>
            </div>
            <div className="relative">
              <select className="text-[11px] font-black border border-slate-200 dark:border-slate-800 hover:border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 cursor-pointer">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>

          <div className="pb-1">
            <h4 className="text-2xl font-black text-slate-900 dark:text-white flex items-baseline gap-2">
              MWK 450,000
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                ↑ 18.4% <span className="text-slate-400 dark:text-slate-500 font-medium font-sans">vs previous 7 days</span>
              </span>
            </h4>
          </div>

          {/* Interactive Line Chart Stage */}
          <div className="h-64 relative pt-4 select-none">
            
            {/* Hover Tooltip display exactly as mocked up */}
            {hoveredRevIdx !== null && (
              <div 
                className="absolute bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-3 z-30 transition-all duration-150 pointer-events-none"
                style={{
                  left: `${points[hoveredRevIdx].x - 60}px`,
                  top: `${points[hoveredRevIdx].y - 85}px`
                }}
              >
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black tracking-wide font-mono">
                  {points[hoveredRevIdx].label}
                </p>
                <p className="text-xs font-black text-slate-950 dark:text-white mt-1">
                  Revenue <span className="text-[#2E7D32] dark:text-emerald-400 font-mono font-black ml-1">{points[hoveredRevIdx].valueDisplay}</span>
                </p>
              </div>
            )}

            <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid guide lines */}
              <line x1="30" y1="20" x2="480" y2="20" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="55" x2="480" y2="55" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="90" x2="480" y2="90" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="125" x2="480" y2="125" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="160" x2="480" y2="160" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1.5" />

              {/* Grid Y labels */}
              <text x="5" y="24" className="text-[8.5px] font-black text-slate-400 font-mono fill-current">160K</text>
              <text x="5" y="59" className="text-[8.5px] font-black text-slate-400 font-mono fill-current">120K</text>
              <text x="5" y="94" className="text-[8.5px] font-black text-slate-400 font-mono fill-current">80K</text>
              <text x="5" y="129" className="text-[8.5px] font-black text-slate-400 font-mono fill-current">40K</text>
              <text x="12" y="164" className="text-[8.5px] font-black text-slate-400 font-mono fill-current">0</text>

              {/* Shaded Area under the line */}
              <path d={areaD} fill="url(#revenueGrad)" />

              {/* Primary line stroke */}
              <path
                d={pathD}
                fill="none"
                stroke="#2E7D32"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Vertical line indicator on hover */}
              {hoveredRevIdx !== null && (
                <line 
                  x1={points[hoveredRevIdx].x} 
                  y1="20" 
                  x2={points[hoveredRevIdx].x} 
                  y2="160" 
                  stroke="#10B981" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                />
              )}

              {/* Dynamic plotting points */}
              {points.map((p, idx) => {
                const isActive = hoveredRevIdx === idx;
                return (
                  <g key={idx} className="cursor-pointer">
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r={isActive ? "7.5" : "5"} 
                      fill={isActive ? "#10B981" : "#2E7D32"} 
                      stroke={isActive ? "#fff" : "transparent"}
                      strokeWidth="2.5"
                      className="transition-all duration-150"
                    />
                    {/* Interactive overlay area for easy hovering */}
                    <rect
                      x={p.x - 20}
                      y="10"
                      width="40"
                      height="160"
                      fill="transparent"
                      onMouseEnter={() => setHoveredRevIdx(idx)}
                      onClick={() => setHoveredRevIdx(idx)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* X Axis Labels */}
            <div className="absolute bottom-0 left-[35px] right-[20px] flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono mt-1 pt-1">
              {REVENUE_DATA.map((item, idx) => (
                <span 
                  key={idx}
                  className={`cursor-pointer transition ${hoveredRevIdx === idx ? "text-[#2E7D32] dark:text-emerald-400 font-black" : ""}`}
                  onMouseEnter={() => setHoveredRevIdx(idx)}
                >
                  {item.day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sales by Category Donut (Spans 1 column) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              Sales by Category
              <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" title="Breakdown of total revenue across student categories" />
            </h3>
            <button 
              onClick={() => alert("Loading granular product catalog categories index...")}
              className="text-[11px] font-bold text-[#2E7D32] hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              View full report
            </button>
          </div>

          {/* Donut Chart Container */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:flex-col xl:flex-row gap-6 py-2">
            
            {/* SVG Donut Slices */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Slice 1: Chicken Shawarma (40%, dasharray=314.16*0.4=125.66, offset=0) */}
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  fill="transparent" 
                  stroke="#2E7D32" 
                  strokeWidth="15" 
                  strokeDasharray="125.66 314.16" 
                  strokeDashoffset="0"
                />
                {/* Slice 2: Beef Noodles (26.7%, dasharray=314.16*0.267=83.88, offset=-125.66) */}
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  fill="transparent" 
                  stroke="#2563EB" 
                  strokeWidth="15" 
                  strokeDasharray="83.88 314.16" 
                  strokeDashoffset="-125.66"
                />
                {/* Slice 3: Grilled Sandwiches (20%, dasharray=314.16*0.2=62.83, offset=-209.54) */}
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  fill="transparent" 
                  stroke="#8B5CF6" 
                  strokeWidth="15" 
                  strokeDasharray="62.83 314.16" 
                  strokeDashoffset="-209.54"
                />
                {/* Slice 4: Iced Coffee (13.3%, dasharray=314.16*0.133=41.78, offset=-272.37) */}
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  fill="transparent" 
                  stroke="#F59E0B" 
                  strokeWidth="15" 
                  strokeDasharray="41.78 314.16" 
                  strokeDashoffset="-272.37"
                />
              </svg>
              
              {/* Inner hole text display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Total Sales</span>
                <span className="text-[11px] font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">MWK 450,000</span>
              </div>
            </div>

            {/* Side Legend Table */}
            <div className="flex-1 space-y-2.5 text-xs">
              {CATEGORIES_DATA.map((cat, index) => (
                <div key={index} className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: cat.color }} 
                    />
                    <span className="text-slate-600 dark:text-slate-300 font-bold leading-tight">{cat.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-slate-900 dark:text-white font-black font-mono block">
                      MWK {cat.amount.toLocaleString()}
                    </span>
                    <span className={`text-[10px] font-bold ${cat.textClass} block mt-0.5`}>
                      ({cat.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 5. TRIPLE BOTTOM GRIDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Box 1: Top Selling Products */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-850">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Top Selling Products</h3>
            <button 
              onClick={() => alert("Loading top products spreadsheet...")}
              className="text-[11px] font-bold text-[#2E7D32] hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              View full report
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {TOP_PRODUCTS.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-9 h-9 rounded-lg object-cover bg-slate-100 dark:bg-slate-800" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-black text-slate-400 font-mono">{item.sold} sold</span>
                      <div className="w-12 bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full ${item.percentageWidth}`} />
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                  MWK {item.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Box 2: Orders Trend */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex justify-between items-center pb-2">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              Orders Trend
              <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" title="Daily quantity of student checkout orders processed" />
            </h3>
            <select className="text-[10px] font-black border border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1 cursor-pointer">
              <option>Daily</option>
              <option>Weekly</option>
            </select>
          </div>

          {/* Orders trend Line points plot */}
          <div className="h-52 relative pt-2">
            <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
              
              {/* Horizontal grid lines */}
              <line x1="35" y1="30" x2="480" y2="30" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="35" y1="65" x2="480" y2="65" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="35" y1="100" x2="480" y2="100" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="35" y1="135" x2="480" y2="135" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1.5" />

              {/* Grid Y labels */}
              <text x="8" y="34" className="text-[8.5px] font-black text-slate-400 font-mono fill-current">40</text>
              <text x="8" y="69" className="text-[8.5px] font-black text-slate-400 font-mono fill-current">30</text>
              <text x="8" y="104" className="text-[8.5px] font-black text-slate-400 font-mono fill-current">20</text>
              <text x="8" y="139" className="text-[8.5px] font-black text-slate-400 font-mono fill-current">10</text>

              {/* Line path connect */}
              <path
                d={orderPathD}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Plot nodes with value print numbers on top */}
              {orderPoints.map((p, idx) => (
                <g key={idx}>
                  {/* Outer circle halo */}
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="4.5" 
                    fill="#10B981" 
                    className="transition hover:r-6" 
                  />
                  {/* Inner center dot */}
                  <circle cx={p.x} cy={p.y} r="2" fill="#fff" />
                  
                  {/* Value text labels floating on top */}
                  <text 
                    x={p.x} 
                    y={p.y - 8} 
                    textAnchor="middle" 
                    className="text-[9px] font-black text-slate-800 dark:text-slate-200 font-mono fill-current"
                  >
                    {p.orders}
                  </text>
                </g>
              ))}
            </svg>

            {/* X Labels row */}
            <div className="absolute bottom-0 left-[35px] right-[20px] flex justify-between text-[9px] font-black text-slate-400 dark:text-slate-500 font-mono">
              {REVENUE_DATA.map((item, idx) => (
                <span key={idx}>{item.day}</span>
              ))}
            </div>
          </div>

          {/* Simple legend */}
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span>Orders</span>
          </div>
        </div>

        {/* Box 3: Traffic Source */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Traffic Source</h3>
            <button 
              onClick={() => alert("Loading visitor referral telemetry data...")}
              className="text-[11px] font-bold text-[#2E7D32] hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              View full report
            </button>
          </div>

          <div className="space-y-3.5">
            {TRAFFIC_SOURCES.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-bold">{item.source}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-900 dark:text-white font-extrabold">{item.visitors.toLocaleString()}</span>
                    <span className="text-slate-400 font-bold text-[10px]">({item.percent}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full ${item.width}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. MARKETING PERFORMANCE & INSIGHTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Box 1: Marketing Performance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                Marketing Performance
                <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" title="Analytics metrics from active catalog discount promotions" />
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
              {/* Purple icon indicator */}
              <div className="p-4 bg-purple-100/80 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded-2xl shrink-0">
                <Megaphone className="w-6 h-6" />
              </div>

              {/* Stats side by side */}
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Promotions</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white block mt-1">2</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-semibold">Running now</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Promotion Views</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white block mt-1">532</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5 font-bold">
                    ▲ 18.4%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Promotion Sales</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white block mt-1 font-mono text-[11px] sm:text-xs">MWK 36,000</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5 font-bold">
                    ▲ 20%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Box 2: Insights */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                Insights
              </h3>
            </div>

            <div className="flex items-start gap-3.5 pt-1">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-500 dark:text-amber-400 rounded-full shrink-0 mt-0.5 flex items-center justify-center">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="space-y-2.5 text-xs">
                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Revenue is up <span className="font-bold text-emerald-600 dark:text-emerald-400">18.4%</span> compared to last week. Keep it up!
                </p>
                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Chicken Shawarma & Meals is your top performing category this week.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
