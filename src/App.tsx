import React, { useState } from 'react';
import { 
  Smartphone, 
  Laptop, 
  Sparkles, 
  Plus, 
  X, 
  Store,
  Compass,
  TrendingUp,
  Percent,
  CheckCircle2,
  Trash2,
  Calendar,
  Sun,
  Moon
} from 'lucide-react';

// Import Types
import { 
  User, 
  Shop, 
  Product, 
  Order, 
  Delivery, 
  Chat, 
  Message, 
  BillboardCampaign, 
  Promotion,
  OrderStatus,
  DeliveryStatus
} from './types';

// Import Mock Data
import { 
  INITIAL_USERS, 
  INITIAL_SHOPS, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_DELIVERIES, 
  INITIAL_CHATS, 
  INITIAL_MESSAGES, 
  INITIAL_BILLBOARDS, 
  INITIAL_PROMOTIONS 
} from './data/mockData';

// Import Modular Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ProductsView from './components/ProductsView';
import OrdersView from './components/OrdersView';
import DeliveriesView from './components/DeliveriesView';
import MessagesView from './components/MessagesView';
import PromotionsView from './components/PromotionsView';
import AnalyticsView from './components/AnalyticsView';
import ShopView from './components/ShopView';
import PayoutsView from './components/PayoutsView';
import ReviewsView from './components/ReviewsView';
import SettingsView from './components/SettingsView';
import AdminPortalView from './components/AdminPortalView';
import SellerMobileView from './components/SellerMobileView';

export default function App() {
  // --- Workspace states ---
  const [viewMode, setViewMode] = useState<'seller' | 'admin'>('seller');
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [university, setUniversity] = useState<string>('MUBAS');
  const [usePhoneMockup, setUsePhoneMockup] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('gula-theme') as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      localStorage.setItem('gula-theme', newTheme);
    } catch (e) {
      console.warn("Storage not available:", e);
    }
    appendLog(`Switched layout theme to ${newTheme.toUpperCase()} mode.`);
  };

  // --- Database states ---
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [shops, setShops] = useState<Shop[]>(INITIAL_SHOPS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [deliveries, setDeliveries] = useState<Delivery[]>(INITIAL_DELIVERIES);
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [billboards, setBillboards] = useState<BillboardCampaign[]>(INITIAL_BILLBOARDS);
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);

  const [systemLogs, setSystemLogs] = useState<string[]>([
    "Brenda Bites updated stock of Chicken Shawarma to 15 items.",
    "Order ORD-4840 marked 'Ready for Delivery' by Brenda Chimwemwe.",
    "Airtel Money instant payout of MWK 150,000 processed for s1.",
    "Student Wongani Phiri placed new order ORD-4840 from Soche Hostel Block.",
    "Admin Tiwonge verified new student account Tiwonge Kumwenda."
  ]);

  // --- Modal / Form states ---
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isCreatePromotionOpen, setIsCreatePromotionOpen] = useState(false);

  // --- Product form states ---
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Food & Meals');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdCondition, setNewProdCondition] = useState<'Brand New' | 'Like New' | 'Gently Used' | 'Fair'>('Brand New');
  const [newProdImg, setNewProdImg] = useState('');

  // --- Promotion form states ---
  const [newPromoProdId, setNewPromoProdId] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState('10');
  const [newPromoDays, setNewPromoDays] = useState('7');

  // --- Helper logger ---
  const appendLog = (message: string) => {
    setSystemLogs(prev => [...prev, `${message} (${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`]);
  };

  // --- Handlers ---
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice || !newProdStock) {
      alert("Please enter a product name, price, and stock count.");
      return;
    }

    const imgFallback = newProdImg.trim() || (
      newProdCategory.includes('Beverages') 
        ? 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=300'
        : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300'
    );

    const productObj: Product = {
      id: `p${products.length + 1}`,
      name: newProdName.trim(),
      description: newProdDesc.trim() || "No description provided.",
      category: newProdCategory,
      price: parseFloat(newProdPrice),
      stock: parseInt(newProdStock),
      images: [imgFallback],
      condition: newProdCondition,
      isAvailable: true,
      shopId: 's1',
      sellerId: 'u1',
      dateAdded: new Date().toISOString().split('T')[0],
      views: 0,
      salesCount: 0
    };

    setProducts(prev => [productObj, ...prev]);
    appendLog(`Added product "${productObj.name}" to menu.`);
    setIsAddProductOpen(false);

    // reset fields
    setNewProdName('');
    setNewProdPrice('');
    setNewProdStock('');
    setNewProdDesc('');
    setNewProdImg('');
  };

  const handleEditProduct = (prod: Product) => {
    setProducts(prev => prev.map(p => p.id === prod.id ? prod : p));
    appendLog(`Modified product "${prod.name}" catalog listing details.`);
  };

  const handleDeleteProduct = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (prod) {
      appendLog(`Deleted product "${prod.name}" from catalog.`);
    }
  };

  const handleUpdateProductStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        appendLog(`Adjusted stock of "${p.name}" to ${newStock} items.`);
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        appendLog(`Updated order status of #${orderId} to "${status}".`);
        return { ...o, status };
      }
      return o;
    }));

    // sync to deliveries if delivered
    if (status === 'Delivered') {
      setDeliveries(prev => prev.map(d => d.orderId === orderId ? { ...d, status: 'Delivered', updatedAt: 'Just now' } : d));
    }
  };

  const handleUpdateDeliveryStatus = (deliveryId: string, status: DeliveryStatus) => {
    setDeliveries(prev => prev.map(d => {
      if (d.id === deliveryId) {
        appendLog(`Updated runner delivery status of tracker #${deliveryId} to "${status}".`);
        return { ...d, status, updatedAt: 'Just now' };
      }
      return d;
    }));

    // sync to order state
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (delivery) {
      setOrders(prev => prev.map(o => o.id === delivery.orderId ? { ...o, status: status as OrderStatus } : o));
    }
  };

  const handleCreatePromotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoProdId) {
      alert("Please select a target product for the promotional offer.");
      return;
    }

    const prod = products.find(p => p.id === newPromoProdId);
    if (!prod) return;

    const promoObj: Promotion = {
      id: `prom-${promotions.length + 1}`,
      productId: newPromoProdId,
      productName: prod.name,
      discountPercent: parseInt(newPromoDiscount),
      expiryDate: new Date(Date.now() + parseInt(newPromoDays) * 24 * 60 * 60 * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      isActive: true
    };

    setPromotions(prev => [promoObj, ...prev]);
    appendLog(`Launched ${newPromoDiscount}% discount campaign for "${prod.name}".`);
    setIsCreatePromotionOpen(false);
  };

  const handleSendMessage = (chatId: string, text: string) => {
    const msgObj: Message = {
      id: `m-${messages.length + 1}`,
      chatId,
      senderId: 'u1',
      text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, msgObj]);
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, lastMessage: text, timestamp: 'Just now', unreadCount: 0 } : c));
    appendLog(`Sent chat reply response on thread #${chatId}.`);
  };

  const handleReceiveMockMessage = (chatId: string, text: string) => {
    const msgObj: Message = {
      id: `m-${messages.length + 2}`,
      chatId,
      senderId: 'u2',
      text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, msgObj]);
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, lastMessage: text, timestamp: 'Just now', unreadCount: 1 } : c));
    appendLog(`Received buyer message inquiry on thread #${chatId}.`);
  };

  const handleAddBillboard = (campaign: Omit<BillboardCampaign, 'id' | 'orderIndex' | 'isActive'>) => {
    const bbObj: BillboardCampaign = {
      ...campaign,
      id: `bb-${billboards.length + 1}`,
      orderIndex: billboards.length,
      isActive: true
    };
    setBillboards(prev => [...prev, bbObj]);
    appendLog(`Created admin spotlight billboard: "${campaign.headline}".`);
  };

  const handleReorderBillboard = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === billboards.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...billboards];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    setBillboards(reordered);
    appendLog("Reordered spotlight billboards layout hierarchy.");
  };

  const handleToggleBillboardActive = (id: string) => {
    setBillboards(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
    appendLog(`Toggled active visibility for billboard campaign #${id}.`);
  };

  const handleDeleteBillboard = (id: string) => {
    setBillboards(prev => prev.filter(b => b.id !== id));
    appendLog(`Removed billboard campaign #${id} permanently.`);
  };

  // --- Render Tab Router ---
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <DashboardView 
            products={products}
            orders={orders}
            deliveries={deliveries}
            chats={chats}
            promotions={promotions}
            setActiveTab={setActiveTab}
            setIsAddProductOpen={setIsAddProductOpen}
            setIsCreatePromotionOpen={setIsCreatePromotionOpen}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
          />
        );
      case 'Products':
        return (
          <ProductsView 
            products={products}
            setIsAddProductOpen={setIsAddProductOpen}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProductStock={handleUpdateProductStock}
          />
        );
      case 'Orders':
        return (
          <OrdersView 
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        );
      case 'Deliveries':
        return (
          <DeliveriesView 
            deliveries={deliveries}
            onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
          />
        );
      case 'Messages':
        return (
          <MessagesView 
            chats={chats}
            messages={messages}
            onSendMessage={handleSendMessage}
            onReceiveMockMessage={handleReceiveMockMessage}
          />
        );
      case 'Promotions':
        return (
          <PromotionsView 
            promotions={promotions}
            products={products}
            setIsCreatePromotionOpen={setIsCreatePromotionOpen}
            onDeletePromotion={(promoId) => setPromotions(prev => prev.filter(p => p.id !== promoId))}
          />
        );
      case 'Analytics':
        return <AnalyticsView />;
      case 'Shop':
        return (
          <ShopView 
            shop={shops[0]}
            seller={users[0]}
            onUpdateShop={(fields) => setShops(prev => prev.map((s, i) => i === 0 ? { ...s, ...fields } : s))}
            onUpdateSeller={(fields) => setUsers(prev => prev.map((u, i) => i === 0 ? { ...u, ...fields } : u))}
          />
        );
      case 'Payouts':
        return <PayoutsView />;
      case 'Reviews':
        return <ReviewsView />;
      case 'Settings':
        return <SettingsView />;
      default:
        return <DashboardView 
          products={products}
          orders={orders}
          deliveries={deliveries}
          chats={chats}
          promotions={promotions}
          setActiveTab={setActiveTab}
          setIsAddProductOpen={setIsAddProductOpen}
          setIsCreatePromotionOpen={setIsCreatePromotionOpen}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
        />;
    }
  };

  // Badges calculations
  const totalOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const totalDeliveriesCount = deliveries.filter(d => d.status !== 'Delivered' && d.status !== 'Cancelled').length;
  const totalChatsCount = chats.filter(c => c.unreadCount > 0).length;

  return (
    <div className={`min-h-screen font-sans flex flex-col selection:bg-[#2E7D32]/20 selection:text-[#2E7D32] transition-colors duration-200 ${
      theme === 'dark' 
        ? "bg-slate-950 text-slate-100 dark" 
        : "bg-slate-100 text-slate-800"
    }`}>
      
      {/* 1. TOP BAR DUAL-WORKSPACE PORTAL SWITCHER */}
      <header className="sticky top-0 z-40 bg-[#1E293B] text-white px-5 py-3 flex flex-wrap gap-4 items-center justify-between shadow-md border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2E7D32] rounded-2xl flex items-center justify-center text-white shadow-md">
            <span className="text-xl">🥗</span>
          </div>
          <div>
            <h1 className="font-black text-sm tracking-wide flex items-center gap-2">
              GULA Marketplace Hub
              <span className="bg-[#2E7D32]/30 text-green-300 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-green-500/30">
                Live Server
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Malawi Student Commerce System • MUBAS & MUST</p>
          </div>
        </div>

        {/* Mode Switchers */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shadow-xs mr-1"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-300" />
            )}
          </button>

          {viewMode === 'seller' && (
            <button
              onClick={() => setUsePhoneMockup(!usePhoneMockup)}
              className="text-xs font-black border border-slate-600 px-3.5 py-1.5 rounded-xl hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer text-slate-300"
            >
              <Smartphone className="w-4 h-4" />
              <span>{usePhoneMockup ? "Switch to Full Desktop App" : "Preview Mobile Mockup"}</span>
            </button>
          )}

          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => {
                setViewMode('seller');
                setActiveTab('Dashboard');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'seller' 
                  ? "bg-[#2E7D32] text-white shadow" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Seller App</span>
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'admin' 
                  ? "bg-[#2E7D32] text-white shadow" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN ENVIRONMENT VIEWS */}
      {viewMode === 'seller' ? (
        // SELLER APP PORTAL
        usePhoneMockup ? (
          // iPhone Frame Mockup simulation
          <div className="flex-1 flex items-center justify-center py-8 bg-slate-100 dark:bg-slate-950">
            <div className="w-[390px] h-[812px] bg-white dark:bg-slate-900 rounded-[40px] border-[10px] border-slate-900 dark:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
              
              {/* Phone speaker speaker, camera notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center">
                <div className="w-12 h-1 bg-slate-700 rounded-full" />
              </div>

              {/* Status bar */}
              <div className="bg-slate-900 h-6 text-white px-6 flex justify-between items-center text-[10px] font-bold shrink-0">
                <span>09:41</span>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <div className="w-4 h-2 bg-white rounded-xs" />
                </div>
              </div>

              {/* Dynamic scrollable mobile contents */}
              <div className="flex-1 overflow-hidden">
                <SellerMobileView 
                  currentUser={users[0]}
                  shop={shops[0]}
                  products={products}
                  orders={orders}
                  deliveries={deliveries}
                  chats={chats}
                  messages={messages}
                  promotions={promotions}
                  onAddProduct={(p) => {
                    const item: Product = {
                      ...p,
                      id: `p${products.length + 1}`,
                      dateAdded: new Date().toISOString().split('T')[0],
                      views: 0,
                      salesCount: 0
                    };
                    setProducts(prev => [item, ...prev]);
                    appendLog(`Added product "${item.name}" from Mobile App.`);
                  }}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
                  onAddPromotion={(pId, disc, days) => {
                    const target = products.find(p => p.id === pId);
                    if (!target) return;
                    const promo: Promotion = {
                      id: `prom-${promotions.length + 1}`,
                      productId: pId,
                      productName: target.name,
                      discountPercent: disc,
                      expiryDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
                      isActive: true
                    };
                    setPromotions(prev => [promo, ...prev]);
                    appendLog(`Added ${disc}% promotion from Mobile App.`);
                  }}
                  onSendMessage={handleSendMessage}
                />
              </div>
            </div>
          </div>
        ) : (
          // Fullscreen Responsive Desktop Dashboard Workspace
          <div className="flex-1 flex min-h-screen">
            {/* Sidebar navigation */}
            <Sidebar 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              ordersBadgeCount={totalOrdersCount}
              deliveriesBadgeCount={totalDeliveriesCount}
              messagesBadgeCount={totalChatsCount}
              setIsCreatePromotionOpen={setIsCreatePromotionOpen}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
              {/* Header */}
              <Header 
                seller={users[0]}
                university={university}
                setUniversity={setUniversity}
                systemLogs={systemLogs}
              />

              {/* Dynamic Sub-View Pane */}
              <main className="p-6 max-w-7xl w-full mx-auto flex-1">
                {renderTabContent()}
              </main>
            </div>
          </div>
        )
      ) : (
        // ADMIN HQ PORTAL
        <div className="p-6 max-w-7xl mx-auto w-full flex-1">
          <AdminPortalView 
            users={users}
            shops={shops}
            products={products}
            orders={orders}
            billboards={billboards}
            promotions={promotions}
            onAddBillboard={handleAddBillboard}
            onReorderBillboard={handleReorderBillboard}
            onDeleteBillboard={handleDeleteBillboard}
            onToggleBillboardActive={handleToggleBillboardActive}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        </div>
      )}

      {/* =======================================
          MODALS LAYOUT OVERLAYS
          ======================================= */}
      
      {/* 1. Add Product Dialog Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-3xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Add New Campus Product</h3>
              <button 
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Product Name</label>
                  <input 
                    type="text" 
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Garlic Cheese Sandwich"
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#2E7D32]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Category</label>
                  <select 
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#2E7D32] bg-white cursor-pointer"
                  >
                    <option>Food & Meals</option>
                    <option>Drinks & Beverages</option>
                    <option>Stationery</option>
                    <option>Clothing</option>
                    <option>Electronics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Price (MWK)</label>
                  <input 
                    type="number" 
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#2E7D32]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Stock Available</label>
                  <input 
                    type="number" 
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#2E7D32]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Condition</label>
                  <select 
                    value={newProdCondition}
                    onChange={(e) => setNewProdCondition(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#2E7D32] bg-white cursor-pointer"
                  >
                    <option>Brand New</option>
                    <option>Like New</option>
                    <option>Gently Used</option>
                    <option>Fair</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Description / Details</label>
                <textarea 
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Describe your meal combo ingredients, serving sizes, or clothing specifications..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#2E7D32] leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Product Image URL (Optional)</label>
                <input 
                  type="text" 
                  value={newProdImg}
                  onChange={(e) => setNewProdImg(e.target.value)}
                  placeholder="e.g. https://images.unsplash.com/..."
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div className="flex gap-2.5 pt-3 justify-end border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-[#2E7D32] hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl transition shadow cursor-pointer"
                >
                  Publish Menu Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Create Promotion Dialog Modal */}
      {isCreatePromotionOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-3xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Launch Student Discount Promo</h3>
              <button 
                onClick={() => setIsCreatePromotionOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePromotion} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Target Product</label>
                <select 
                  value={newPromoProdId}
                  onChange={(e) => setNewPromoProdId(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#2E7D32] bg-white cursor-pointer"
                  required
                >
                  <option value="">Select a product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (MWK {p.price.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Discount Percentage</label>
                  <select 
                    value={newPromoDiscount}
                    onChange={(e) => setNewPromoDiscount(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#2E7D32] bg-white cursor-pointer"
                  >
                    <option value="5">5% OFF</option>
                    <option value="10">10% OFF</option>
                    <option value="15">15% OFF</option>
                    <option value="20">20% OFF</option>
                    <option value="25">25% OFF</option>
                    <option value="50">50% OFF</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Active Duration</label>
                  <select 
                    value={newPromoDays}
                    onChange={(e) => setNewPromoDays(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#2E7D32] bg-white cursor-pointer"
                  >
                    <option value="1">1 Day</option>
                    <option value="3">3 Days</option>
                    <option value="5">5 Days</option>
                    <option value="7">7 Days (Weekly Special)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-3 justify-end border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsCreatePromotionOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-[#2E7D32] hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl transition shadow cursor-pointer"
                >
                  Launch Promo Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
