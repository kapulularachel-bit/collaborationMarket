import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { supabase } from "./lib/supabase";
import AuthScreen from "./components/AuthScreen";
import Onboarding from "./components/Onboarding";
import Sidebar, { type ViewName } from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import ShopView from "./components/ShopView";
import ProductsView from "./components/ProductsView";
import OrdersView from "./components/OrdersView";
import DeliveriesView from "./components/DeliveriesView";
import MessagesView from "./components/MessagesView";
import PromotionsView from "./components/PromotionsView";
import AnalyticsView from "./components/AnalyticsView";
import PayoutsView from "./components/PayoutsView";
import ReviewsView from "./components/ReviewsView";
import SettingsView from "./components/SettingsView";
import AdminPortalView from "./components/AdminPortalView";

const viewTitles: Record<ViewName, string> = {
  dashboard: "Dashboard",
  shop: "My Shop",
  products: "Products",
  orders: "Orders",
  deliveries: "Deliveries",
  messages: "Messages",
  promotions: "Promotions",
  analytics: "Analytics",
  payouts: "Payouts",
  reviews: "Reviews",
  settings: "Settings",
  admin: "Admin Portal",
};

function AppContent() {
  const { session, profile, loading } = useAuth();
  const [view, setView] = useState<ViewName>("dashboard");
  const [hasShop, setHasShop] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (!profile) return;
    if (profile.role === "admin") {
      setHasShop(true);
      return;
    }
    supabase
      .from("shops")
      .select("id")
      .eq("seller_id", profile.id)
      .maybeSingle()
      .then(({ data }) => setHasShop(!!data));
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    supabase
      .from("chats")
      .select("unread_count")
      .eq("shop_id", profile.id)
      .then(({ data }) => {
        if (data) {
          const total = data.reduce((s: number, c: { unread_count: number }) => s + c.unread_count, 0);
          setUnreadMessages(total);
        }
      });
  }, [profile]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gula-600 text-white">
            <span className="text-xl font-bold">G</span>
          </div>
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return <AuthScreen />;

  if (profile && profile.role === "seller" && hasShop === false) {
    return <Onboarding onComplete={() => setHasShop(true)} />;
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-400">Setting up your profile...</p>
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case "dashboard": return <DashboardView />;
      case "shop": return <ShopView />;
      case "products": return <ProductsView />;
      case "orders": return <OrdersView />;
      case "deliveries": return <DeliveriesView />;
      case "messages": return <MessagesView />;
      case "promotions": return <PromotionsView />;
      case "analytics": return <AnalyticsView />;
      case "payouts": return <PayoutsView />;
      case "reviews": return <ReviewsView />;
      case "settings": return <SettingsView />;
      case "admin": return <AdminPortalView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <div className={`fixed inset-0 z-40 bg-black/40 lg:hidden ${sidebarOpen ? "" : "hidden"}`} onClick={() => setSidebarOpen(false)} />
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar
          current={view}
          onNavigate={(v) => { setView(v); setSidebarOpen(false); }}
          profile={profile}
          unreadMessages={unreadMessages}
        />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={viewTitles[view]} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {view === "messages" ? renderView() : <div className="animate-fade-in">{renderView()}</div>}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
