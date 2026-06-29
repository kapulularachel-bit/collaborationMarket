import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Truck,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Clock,
  ChevronRight,
  Send,
  User as UserIcon,
  Bell,
  Check,
  Percent,
  Calendar,
  X,
  PlusCircle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Camera,
  Store,
  Tag,
  Share2
} from 'lucide-react';
import { User, Shop, Product, Order, Delivery, Chat, Message, Promotion } from '../types';

interface SellerMobileViewProps {
  currentUser: User;
  shop: Shop;
  products: Product[];
  orders: Order[];
  deliveries: Delivery[];
  chats: Chat[];
  messages: Message[];
  promotions: Promotion[];
  onAddProduct: (product: Omit<Product, 'id' | 'dateAdded' | 'views' | 'salesCount'>) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateDeliveryStatus: (deliveryId: string, status: Delivery['status']) => void;
  onAddPromotion: (productId: string, discount: number, days: number) => void;
  onSendMessage: (chatId: string, text: string) => void;
}

export default function SellerMobileView({
  currentUser,
  shop,
  products,
  orders,
  deliveries,
  chats,
  messages,
  promotions,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateDeliveryStatus,
  onAddPromotion,
  onSendMessage
}: SellerMobileViewProps) {
  // Mobile Navigation state: 'dashboard' | 'products' | 'orders' | 'messages' | 'profile'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'messages' | 'profile'>('dashboard');
  
  // Modal states
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isCreatePromotionOpen, setIsCreatePromotionOpen] = useState(false);
  const [isEditShopOpen, setIsEditShopOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  // Form states for creating a product
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Food & Meals');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductCondition, setNewProductCondition] = useState<Product['condition']>('Brand New');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductImg, setNewProductImg] = useState('');

  // Form states for promotion
  const [promoProductId, setPromoProductId] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('10');
  const [promoDays, setPromoDays] = useState('5');

  // Form states for chat
  const [chatInputText, setChatInputText] = useState('');

  // Edit product states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Notifications simulation
  const [notifications, setNotifications] = useState([
    { id: 'n1', text: 'New order ORD-3312 received for notebooks!', time: '10m ago', unread: true },
    { id: 'n2', text: 'Delivery for MUBAS Hoodies is Ready for Pickup.', time: '1h ago', unread: false },
    { id: 'n3', text: 'Chat message from Aliko Phiri regarding order delivery.', time: '2h ago', unread: true },
  ]);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  // Local helper stats
  const activeOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled');
  const pendingDeliveries = deliveries.filter(d => d.status !== 'Completed' && d.status !== 'Cancelled');
  const totalSalesVal = orders
    .filter(o => o.status === 'Completed' || o.status === 'Delivered' || o.status === 'In Delivery' || o.status === 'Ready for Delivery' || o.status === 'Preparing' || o.status === 'Accepted')
    .reduce((sum, o) => sum + (o.price * o.quantity), 0);

  // Status badge style helper
  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Preparing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Ready for Delivery': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'In Delivery': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;
    
    // Pick realistic default image if empty
    const imgUrl = newProductImg || (
      newProductCategory === 'Food & Meals' ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300' :
      newProductCategory === 'Electronics' ? 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=300' :
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=300'
    );

    onAddProduct({
      name: newProductName,
      description: newProductDesc || 'No description provided.',
      category: newProductCategory,
      price: Number(newProductPrice),
      stock: Number(newProductStock) || 1,
      images: [imgUrl],
      condition: newProductCondition,
      isAvailable: true,
      shopId: shop.id,
      sellerId: currentUser.id
    });

    // Reset Form
    setNewProductName('');
    setNewProductPrice('');
    setNewProductStock('');
    setNewProductDesc('');
    setNewProductImg('');
    setIsAddProductOpen(false);
  };

  const handlePromotionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoProductId) return;
    onAddPromotion(promoProductId, Number(promoDiscount), Number(promoDays));
    setIsCreatePromotionOpen(false);
  };

  const handleSendChatMessage = () => {
    if (!chatInputText.trim() || !activeChatId) return;
    onSendMessage(activeChatId, chatInputText);
    setChatInputText('');
  };

  const activeChat = chats.find(c => c.id === activeChatId);
  const activeChatMessages = messages.filter(m => m.chatId === activeChatId);

  return (
    <div className="relative w-full max-w-[420px] h-[780px] bg-slate-50 text-slate-900 rounded-[38px] border-[12px] border-slate-900 shadow-2xl overflow-hidden flex flex-col font-sans mx-auto">
      
      {/* Phone Notch/Speaker Header */}
      <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-b-xl z-50 flex items-center justify-between px-6 text-white text-[11px] font-semibold">
        <span>09:41</span>
        <div className="w-16 h-3 bg-slate-950 rounded-full mx-auto -mt-1"></div>
        <div className="flex items-center gap-1">
          <span className="text-[10px]">🇲🇼 MUBAS LTE</span>
          <div className="w-4 h-2.5 bg-white rounded-xs"></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 mt-6 overflow-y-auto pb-20 scrollbar-none">
        
        {/* Top Header App Bar */}
        <div className="bg-white px-4 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between shadow-xs sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium">Hello,</span>
              <span className="text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {currentUser.university}
              </span>
            </div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Good Morning, Brenda</h1>
            <p className="text-xs text-emerald-700 font-medium">{shop.name}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification button */}
            <button 
              onClick={() => setShowNotificationMenu(!showNotificationMenu)}
              className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-600 rounded-full border-2 border-white"></span>
              )}
            </button>
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-9 h-9 rounded-full object-cover border-2 border-emerald-600"
              onClick={() => setActiveTab('profile')}
            />
          </div>
        </div>

        {/* Notifications Dropdown Panel (Simulated in-app popover) */}
        {showNotificationMenu && (
          <div className="absolute top-20 right-4 left-4 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
              <button 
                onClick={() => {
                  setNotifications(notifications.map(n => ({...n, unread: false})));
                }}
                className="text-[11px] text-emerald-700 hover:underline font-semibold"
              >
                Mark all as read
              </button>
            </div>
            <div className="space-y-2.5">
              {notifications.map((n) => (
                <div key={n.id} className={`p-2 rounded-lg text-xs flex gap-2 ${n.unread ? 'bg-emerald-50/50 border-l-2 border-emerald-600' : 'bg-slate-50'}`}>
                  <div className="flex-1">
                    <p className="text-slate-700 font-medium">{n.text}</p>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                  {n.unread && <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full self-center"></span>}
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowNotificationMenu(false)}
              className="mt-3 w-full py-1.5 text-center text-xs bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-medium"
            >
              Close Panel
            </button>
          </div>
        )}

        {/* ==================================
            TAB 1: DASHBOARD VIEW
           ================================== */}
        {activeTab === 'dashboard' && (
          <div className="p-4 space-y-4 animate-in fade-in duration-300">
            
            {/* Top Statistics Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Total Products</span>
                  <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-700">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl font-black text-slate-900">{products.length}</h3>
                  <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Active Listings</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Active Orders</span>
                  <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-700">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl font-black text-slate-900">{activeOrders.length}</h3>
                  <p className="text-[10px] text-amber-600 font-medium mt-0.5">Processing</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Deliveries</span>
                  <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-700">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl font-black text-slate-900">{pendingDeliveries.length}</h3>
                  <p className="text-[10px] text-blue-600 font-medium mt-0.5">Out for delivery</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Monthly Sales</span>
                  <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-700">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-[16px] font-black text-slate-900 tracking-tight">MWK {totalSalesVal.toLocaleString()}</h3>
                  <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Updated live</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
              <div className="grid grid-cols-5 gap-1.5 text-center">
                <button 
                  onClick={() => setIsAddProductOpen(true)}
                  className="flex flex-col items-center gap-1 p-1 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center text-white shadow-sm shadow-emerald-200">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-700">Add Product</span>
                </button>

                <button 
                  onClick={() => setActiveTab('orders')}
                  className="flex flex-col items-center gap-1 p-1 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-800">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-700">View Orders</span>
                </button>

                <button 
                  onClick={() => setActiveTab('messages')}
                  className="flex flex-col items-center gap-1 p-1 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-800">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-700">Messages</span>
                </button>

                <button 
                  onClick={() => setIsCreatePromotionOpen(true)}
                  className="flex flex-col items-center gap-1 p-1 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-800">
                    <Percent className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-700">Promotions</span>
                </button>

                <button 
                  onClick={() => setActiveTab('profile')}
                  className="flex flex-col items-center gap-1 p-1 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-800">
                    <Store className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-700">Manage Shop</span>
                </button>
              </div>
            </div>

            {/* Delivery Tracker Widget */}
            <div className="bg-emerald-800 text-white p-4 rounded-2xl shadow-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                <Truck className="w-40 h-40" />
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] bg-emerald-900/50 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider text-emerald-200">
                  Active Delivery Tracker
                </span>
                <Truck className="w-4 h-4 text-emerald-300" />
              </div>

              {deliveries.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mt-1">
                    <h4 className="font-bold text-sm tracking-tight">{deliveries[0].products}</h4>
                    <span className="text-[10px] bg-white text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                      {deliveries[0].status}
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-emerald-100 flex flex-col gap-1">
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 opacity-80" />
                      <span>{deliveries[0].deliveryLocation}</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <UserIcon className="w-3.5 h-3.5 opacity-80" />
                      <span>Buyer: {deliveries[0].buyerName} ({deliveries[0].preferredTime})</span>
                    </p>
                  </div>

                  {/* Delivery Status Update Buttons */}
                  <div className="mt-4 pt-3 border-t border-emerald-700/50 flex gap-2 justify-end">
                    {deliveries[0].status === 'Preparing Order' && (
                      <button 
                        onClick={() => onUpdateDeliveryStatus(deliveries[0].id, 'Ready for Pickup')}
                        className="px-3 py-1 bg-white text-emerald-800 text-[11px] font-bold rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        Mark Ready for Pickup
                      </button>
                    )}
                    {deliveries[0].status === 'Ready for Pickup' && (
                      <button 
                        onClick={() => onUpdateDeliveryStatus(deliveries[0].id, 'Out for Delivery')}
                        className="px-3 py-1 bg-white text-emerald-800 text-[11px] font-bold rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        Set Out for Delivery
                      </button>
                    )}
                    {deliveries[0].status === 'Out for Delivery' && (
                      <button 
                        onClick={() => onUpdateDeliveryStatus(deliveries[0].id, 'Delivered')}
                        className="px-3 py-1 bg-white text-emerald-800 text-[11px] font-bold rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        Confirm Delivered
                      </button>
                    )}
                    <a 
                      href={`tel:${deliveries[0].buyerContact}`}
                      className="px-3 py-1 bg-emerald-700/60 hover:bg-emerald-700 text-white border border-emerald-600 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center"
                    >
                      Call Buyer
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-emerald-200 py-2">No active deliveries at the moment.</p>
              )}
            </div>

            {/* Recent Orders Widget */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-extrabold text-slate-800">Recent Incoming Orders</h3>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-0.5"
                >
                  All ({orders.length}) <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex gap-3 items-center justify-between pb-3 border-b border-slate-100 last:border-none last:pb-0">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={order.productImage} 
                        alt={order.productName} 
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100" 
                      />
                      <div className="max-w-[150px]">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{order.productName}</h4>
                        <p className="text-[10px] text-slate-500 font-medium">By {order.buyerName}</p>
                        <p className="text-[9px] text-slate-400 font-medium">{order.orderDate}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">MWK {order.price.toLocaleString()}</p>
                      <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-bold border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deals & Promotions Widget */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Deals & Active Promotions</h3>
                  <p className="text-[10px] text-slate-500">Highlight items to boost store reach</p>
                </div>
                <button 
                  onClick={() => setIsCreatePromotionOpen(true)}
                  className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-emerald-100"
                >
                  <Plus className="w-3.5 h-3.5" /> Promo
                </button>
              </div>

              {promotions.length > 0 ? (
                <div className="space-y-2.5">
                  {promotions.map((promo) => (
                    <div key={promo.id} className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center font-black text-xs">
                          %{promo.discountPercent}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 truncate max-w-[170px]">{promo.productName}</h4>
                          <p className="text-[9px] text-slate-400 font-medium">Expires: {promo.expiryDate}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">No active promotions. Promote products to double views!</p>
              )}
            </div>

            {/* Small Analytics Preview Section */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-800 mb-2">Performance Analytics</h3>
              <div className="grid grid-cols-2 gap-2 text-center pt-1">
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-medium">Orders This Week</span>
                  <p className="text-lg font-extrabold text-slate-800">14</p>
                  <span className="text-[9px] text-emerald-600 font-bold">+18% growth</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-medium">Top Category</span>
                  <p className="text-lg font-extrabold text-slate-800">Food</p>
                  <span className="text-[9px] text-emerald-600 font-bold">Chambo Meals</span>
                </div>
              </div>
              <div className="mt-3 h-20 w-full bg-slate-50 rounded-xl p-2 flex items-end justify-between gap-1">
                {/* Simulated bar chart */}
                {[20, 35, 15, 60, 45, 80, 50].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-emerald-700 rounded-t" style={{ height: `${val}%` }}></div>
                    <span className="text-[8px] text-slate-400 mt-1">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================================
            TAB 2: PRODUCTS LIST VIEW
           ================================== */}
        {activeTab === 'products' && (
          <div className="p-4 space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-extrabold text-slate-950">Store Products</h2>
                <p className="text-xs text-slate-500">{products.length} products listed</p>
              </div>
              <button 
                onClick={() => setIsAddProductOpen(true)}
                className="px-3 py-1.5 bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 hover:bg-emerald-800 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add New
              </button>
            </div>

            <div className="space-y-3">
              {products.map((p) => {
                const promo = promotions.find(pr => pr.productId === p.id);
                return (
                  <div key={p.id} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs flex gap-3 relative">
                    <img 
                      src={p.images[0]} 
                      alt={p.name} 
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0" 
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                          {p.category}
                        </span>
                        {promo && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-black flex items-center gap-0.5">
                            <Tag className="w-2.5 h-2.5" /> -{promo.discountPercent}%
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs font-bold text-slate-900 truncate">{p.name}</h3>
                      
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-xs font-black text-slate-950">
                          MWK {(promo ? p.price * (1 - promo.discountPercent / 100) : p.price).toLocaleString()}
                        </span>
                        {promo && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {p.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
                        <span>Stock: <strong className="text-slate-800">{p.stock}</strong></span>
                        <span>•</span>
                        <span>Condition: <strong className="text-slate-800">{p.condition}</strong></span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end">
                      <div className="flex gap-1">
                        <button 
                          onClick={() => {
                            setEditingProduct(p);
                            setNewProductName(p.name);
                            setNewProductCategory(p.category);
                            setNewProductPrice(p.price.toString());
                            setNewProductStock(p.stock.toString());
                            setNewProductCondition(p.condition);
                            setNewProductDesc(p.description);
                            setNewProductImg(p.images[0]);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase ${p.stock > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================
            TAB 3: ORDERS LIST VIEW & ACTIONS
           ================================== */}
        {activeTab === 'orders' && (
          <div className="p-4 space-y-4 animate-in fade-in duration-300">
            <div>
              <h2 className="text-base font-extrabold text-slate-950">Campus Orders</h2>
              <p className="text-xs text-slate-500">Manage incoming and historical client requests</p>
            </div>

            <div className="space-y-3.5">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
                  <div className="flex justify-between items-start border-b border-slate-50 pb-2.5 mb-2.5">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">{order.id}</span>
                      <p className="text-[10px] text-slate-400">{order.orderDate}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <img 
                      src={order.productImage} 
                      alt={order.productName} 
                      className="w-12 h-12 rounded-xl object-cover bg-slate-50 flex-shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{order.productName}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Qty: {order.quantity} • Total: MWK {(order.price * order.quantity).toLocaleString()}</p>
                      
                      {/* Buyer Details */}
                      <div className="mt-2 p-1.5 bg-slate-50 rounded-lg text-[10px] text-slate-600 space-y-0.5">
                        <p className="font-semibold text-slate-800 flex items-center gap-1">
                          <UserIcon className="w-3 h-3 text-emerald-700" /> Buyer: {order.buyerName}
                        </p>
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> Loc: {order.deliveryLocation}
                        </p>
                        {order.notes && <p className="italic text-slate-400 truncate">"{order.notes}"</p>}
                      </div>
                    </div>
                  </div>

                  {/* Order Actions based on current status */}
                  <div className="mt-3 pt-2.5 border-t border-slate-50 flex gap-2 justify-end">
                    {order.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => onUpdateOrderStatus(order.id, 'Cancelled')}
                          className="px-2.5 py-1 text-[11px] font-bold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => onUpdateOrderStatus(order.id, 'Accepted')}
                          className="px-3 py-1 text-[11px] font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors"
                        >
                          Accept Order
                        </button>
                      </>
                    )}

                    {order.status === 'Accepted' && (
                      <button 
                        onClick={() => onUpdateOrderStatus(order.id, 'Preparing')}
                        className="px-3 py-1 text-[11px] font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Start Preparing Food/Item
                      </button>
                    )}

                    {order.status === 'Preparing' && (
                      <button 
                        onClick={() => onUpdateOrderStatus(order.id, 'Ready for Delivery')}
                        className="px-3 py-1 text-[11px] font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors"
                      >
                        Set Ready for Delivery
                      </button>
                    )}

                    {order.status === 'Ready for Delivery' && (
                      <button 
                        onClick={() => onUpdateOrderStatus(order.id, 'Delivered')}
                        className="px-3 py-1 text-[11px] font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Complete Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================
            TAB 4: MESSAGES VIEW
           ================================== */}
        {activeTab === 'messages' && (
          <div className="p-4 space-y-4 animate-in fade-in duration-300">
            <div>
              <h2 className="text-base font-extrabold text-slate-950">GULA Chats</h2>
              <p className="text-xs text-slate-500">Contact buyers directly to coordinate exchanges</p>
            </div>

            {activeChatId ? (
              /* ACTIVE CHAT DETAIL VIEW */
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[400px]">
                {/* Chat header */}
                <div className="bg-slate-50 p-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setActiveChatId(null)}
                      className="p-1 hover:bg-slate-200 rounded-lg text-slate-600"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <img 
                      src={activeChat?.buyerAvatar} 
                      alt={activeChat?.buyerName} 
                      className="w-8 h-8 rounded-full object-cover" 
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{activeChat?.buyerName}</h4>
                      <p className="text-[9px] text-slate-400">Online • MUBAS Student</p>
                    </div>
                  </div>
                  {activeChat?.productId && (
                    <span className="text-[9px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      Order Inquiry
                    </span>
                  )}
                </div>

                {/* Messages body */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50/50">
                  {activeChatMessages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-xl p-2.5 text-xs ${isMe ? 'bg-emerald-700 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                          
                          {/* Optional context item */}
                          {msg.productContext && (
                            <div className="bg-slate-100 text-slate-800 rounded-lg p-1.5 mb-2 flex items-center gap-2">
                              <img src={msg.productContext.image} alt="" className="w-8 h-8 rounded object-cover" />
                              <div className="text-[9px]">
                                <p className="font-bold truncate">{msg.productContext.name}</p>
                                <p className="font-semibold text-emerald-700">MWK {msg.productContext.price.toLocaleString()}</p>
                              </div>
                            </div>
                          )}

                          <p className="leading-relaxed">{msg.text}</p>
                          <span className={`block text-[8px] mt-1 text-right ${isMe ? 'text-emerald-200' : 'text-slate-400'}`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chat input footer */}
                <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 items-center">
                  <input 
                    type="text" 
                    placeholder="Type message..." 
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    className="flex-1 px-3 py-2 bg-slate-50 border-none rounded-xl text-xs focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                  <button 
                    onClick={handleSendChatMessage}
                    className="p-2 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* CHAT DIRECTORY LIST */
              <div className="space-y-2">
                {chats.map((chat) => (
                  <div 
                    key={chat.id} 
                    onClick={() => setActiveChatId(chat.id)}
                    className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between hover:border-emerald-200 transition-all cursor-pointer"
                  >
                    <div className="flex gap-3 items-center min-w-0">
                      <img 
                        src={chat.buyerAvatar} 
                        alt={chat.buyerName} 
                        className="w-11 h-11 rounded-full object-cover flex-shrink-0" 
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900">{chat.buyerName}</h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{chat.lastMessage}</p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end flex-shrink-0 ml-2">
                      <span className="text-[9px] text-slate-400">{chat.timestamp}</span>
                      {chat.unreadCount > 0 && (
                        <span className="mt-1 w-5 h-5 bg-emerald-600 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================
            TAB 5: PROFILE / SHOP MANAGEMENT
           ================================== */}
        {activeTab === 'profile' && (
          <div className="p-4 space-y-4 animate-in fade-in duration-300">
            {/* Store Cover Banner */}
            <div className="relative rounded-2xl overflow-hidden h-28 bg-slate-200 border border-slate-100">
              <img src={shop.coverImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute bottom-3 left-3 flex gap-2 items-center">
                <img src={shop.logo} alt="" className="w-10 h-10 rounded-xl border border-white object-cover" />
                <div className="text-white">
                  <h3 className="text-xs font-black tracking-tight">{shop.name}</h3>
                  <p className="text-[10px] text-slate-200 flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" /> {shop.location}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditShopOpen(true)}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1.5 rounded-lg text-[10px] font-bold text-slate-800"
              >
                Edit
              </button>
            </div>

            {/* Shop Details */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About Brenda's Shop</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{shop.description}</p>
              
              <div className="pt-2 border-t border-slate-50 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 block">Campus Reach</span>
                  <strong className="text-slate-800">{shop.university} Student Body</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Rating feedback</span>
                  <strong className="text-slate-800">⭐ {shop.rating} / 5.0 Rating</strong>
                </div>
              </div>
            </div>

            {/* User Account Info */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Profile</h3>
              <div className="flex gap-3 items-center">
                <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{currentUser.name}</h4>
                  <p className="text-[10px] text-slate-400">{currentUser.email}</p>
                  <p className="text-[10px] text-slate-400">Resides at: {currentUser.residence}</p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-50 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact Number</span>
                  <span className="font-medium text-slate-800">{currentUser.contact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registered On</span>
                  <span className="font-medium text-slate-800">{currentUser.registrationDate}</span>
                </div>
              </div>
            </div>

            {/* Simulated settings list */}
            <div className="space-y-1.5">
              <button className="w-full bg-white p-3 rounded-xl border border-slate-100 text-left text-xs font-bold text-slate-800 flex justify-between items-center hover:bg-slate-50">
                <span>Manage Delivery Hours</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button className="w-full bg-white p-3 rounded-xl border border-slate-100 text-left text-xs font-bold text-slate-800 flex justify-between items-center hover:bg-slate-50">
                <span>Configure Wallet & Cash Out</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button className="w-full bg-white p-3 rounded-xl border border-slate-100 text-left text-xs font-bold text-rose-600 flex justify-between items-center hover:bg-rose-50/50">
                <span>Sign Out of GULA Account</span>
                <ChevronRight className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* FLOATING ACTION BUTTON */}
      {activeTab === 'dashboard' && (
        <button 
          onClick={() => setIsAddProductOpen(true)}
          className="absolute right-6 bottom-20 w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-800 transition-all z-20 active:scale-95"
          title="Add Product"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* BOTTOM NAVIGATION TAB BAR */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-slate-100 flex items-center justify-around px-2 z-30 shadow-lg">
        <button 
          onClick={() => { setActiveTab('dashboard'); setActiveChatId(null); }}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'dashboard' ? 'text-emerald-700 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[9px]">Dashboard</span>
        </button>

        <button 
          onClick={() => { setActiveTab('products'); setActiveChatId(null); }}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'products' ? 'text-emerald-700 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[9px]">Products</span>
        </button>

        <button 
          onClick={() => { setActiveTab('orders'); setActiveChatId(null); }}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'orders' ? 'text-emerald-700 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[9px]">Orders</span>
        </button>

        <button 
          onClick={() => { setActiveTab('messages'); }}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'messages' ? 'text-emerald-700 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[9px]">Messages</span>
        </button>

        <button 
          onClick={() => { setActiveTab('profile'); setActiveChatId(null); }}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'profile' ? 'text-emerald-700 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[9px]">Profile</span>
        </button>
      </div>

      {/* ==================================
          MODAL: ADD PRODUCT FORM
         ================================== */}
      {isAddProductOpen && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center">
          <div className="bg-white w-full rounded-t-[28px] max-h-[90%] overflow-y-auto p-5 space-y-4 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">List New Student Product</h3>
              <button 
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-3.5 text-xs text-slate-700">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Product Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Scientific Calculator or Chambo fish" 
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Category</label>
                  <select 
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs"
                  >
                    <option value="Food & Meals">Food & Meals</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Services">Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Condition</label>
                  <select 
                    value={newProductCondition}
                    onChange={(e) => setNewProductCondition(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Like New">Like New</option>
                    <option value="Gently Used">Gently Used</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Price (MWK) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 15000" 
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Stock Amount</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 5" 
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Photo Link (Unsplash URL or blank for category default)</label>
                <input 
                  type="text" 
                  placeholder="Paste image web address here" 
                  value={newProductImg}
                  onChange={(e) => setNewProductImg(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Description</label>
                <textarea 
                  rows={2}
                  placeholder="Describe your product status, delivery points..." 
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-center hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 text-white font-bold rounded-xl text-center hover:bg-emerald-800 transition-colors shadow-sm"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================
          MODAL: EDIT PRODUCT FORM (POPUP)
         ================================== */}
      {editingProduct && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center">
          <div className="bg-white w-full rounded-t-[28px] max-h-[90%] overflow-y-auto p-5 space-y-4 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">Modify Listing</h3>
              <button 
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                onEditProduct({
                  ...editingProduct,
                  name: newProductName,
                  category: newProductCategory,
                  price: Number(newProductPrice),
                  stock: Number(newProductStock),
                  condition: newProductCondition,
                  description: newProductDesc,
                  images: [newProductImg]
                });
                setEditingProduct(null);
              }} 
              className="space-y-3.5 text-xs text-slate-700"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Category</label>
                  <select 
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs"
                  >
                    <option value="Food & Meals">Food & Meals</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Services">Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Condition</label>
                  <select 
                    value={newProductCondition}
                    onChange={(e) => setNewProductCondition(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Like New">Like New</option>
                    <option value="Gently Used">Gently Used</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Price (MWK)</label>
                  <input 
                    type="number" 
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Stock Amount</label>
                  <input 
                    type="number" 
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Photo Link</label>
                <input 
                  type="text" 
                  value={newProductImg}
                  onChange={(e) => setNewProductImg(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Description</label>
                <textarea 
                  rows={2}
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-center hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 text-white font-bold rounded-xl text-center hover:bg-emerald-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================
          MODAL: CREATE PROMOTION FORM
         ================================== */}
      {isCreatePromotionOpen && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center">
          <div className="bg-white w-full rounded-t-[28px] p-5 space-y-4 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">Create Campus Discount Deal</h3>
              <button 
                onClick={() => setIsCreatePromotionOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handlePromotionSubmit} className="space-y-3.5 text-xs text-slate-700">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Select Product *</label>
                <select 
                  required
                  value={promoProductId}
                  onChange={(e) => setPromoProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs"
                >
                  <option value="">-- Choose listed product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (MWK {p.price.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Discount %</label>
                  <select 
                    value={promoDiscount}
                    onChange={(e) => setPromoDiscount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs"
                  >
                    <option value="5">5% OFF</option>
                    <option value="10">10% OFF</option>
                    <option value="15">15% OFF</option>
                    <option value="20">20% OFF</option>
                    <option value="25">25% OFF</option>
                    <option value="50">50% Half Price!</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Duration (max 7 days)</label>
                  <select 
                    value={promoDays}
                    onChange={(e) => setPromoDays(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs"
                  >
                    <option value="1">1 Day</option>
                    <option value="3">3 Days</option>
                    <option value="5">5 Days</option>
                    <option value="7">7 Days</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-amber-900 border border-amber-100 text-[10px] leading-relaxed flex gap-2">
                <Percent className="w-5 h-5 flex-shrink-0 text-amber-700" />
                <p>Promotions highlight your item on the <strong>GULA Billboard Carousel</strong>, exposing it to 1,500+ active students at MUBAS and MUST campuses.</p>
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  type="button"
                  onClick={() => setIsCreatePromotionOpen(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-center hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 text-white font-bold rounded-xl text-center hover:bg-emerald-800"
                >
                  Launch Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
