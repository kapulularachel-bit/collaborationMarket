import { useEffect, useState } from "react";
import { useAuth } from "./lib/AuthContext";
import { supabase } from "./lib/supabase";
import AuthScreen from "./components/AuthScreen";
import Onboarding from "./components/Onboarding";
import Sidebar from "./components/Sidebar";
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

export type ViewName =
  | "dashboard" | "shop" | "products" | "orders" | "deliveries"
  | "messages" | "promotions" | "analytics" | "payouts"
  | "reviews" | "settings" | "admin";

export default function App() {
  const { session, profile, loading } = useAuth();
  const [view, setView] = useState<ViewName>("dashboard");
  const [shopId, setShopId] = useState<string | null>(null);
  const [hasShop, setHasShop] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Role-based landing: admins go to admin portal, sellers go to dashboard
  useEffect(() => {
    if (!profile) return;
    if (profile.role === "admin") {
      setView("admin");
      setHasShop(true);
      return;
    }
    // Seller: check if they have a shop
    if (hasShop === null) {
      supabase.from("shops").select("id").eq("seller_id", profile.id).maybeSingle()
        .then(({ data }) => {
          setShopId(data?.id ?? null);
          setHasShop(!!data);
        });
    }
  }, [profile, hasShop]);

  // Keep shopId in sync when hasShop becomes true
  useEffect(() => {
    if (hasShop && !shopId && profile) {
      supabase.from("shops").select("id").eq("seller_id", profile.id).maybeSingle()
        .then(({ data }) => { if (data) setShopId(data.id); });
    }
  }, [hasShop, shopId, profile]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-sm text-slate-400 dark:text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!session) return <AuthScreen />;

  if (profile?.role !== "admin" && hasShop === false) {
    return <Onboarding onDone={() => setHasShop(true)} />;
  }

  const isAdmin = profile?.role === "admin";

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar view={view} setView={setView} profile={profile} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {view === "admin" && isAdmin ? (
            <AdminPortalView />
          ) : view === "settings" ? (
            <SettingsView />
          ) : isAdmin ? (
            <AdminPortalView />
          ) : (
            <>
              {view === "dashboard" && <DashboardView shopId={shopId} />}
              {view === "shop" && <ShopView shopId={shopId} />}
              {view === "products" && <ProductsView shopId={shopId} />}
              {view === "orders" && <OrdersView shopId={shopId} />}
              {view === "deliveries" && <DeliveriesView shopId={shopId} />}
              {view === "messages" && <MessagesView shopId={shopId} />}
              {view === "promotions" && <PromotionsView shopId={shopId} />}
              {view === "analytics" && <AnalyticsView shopId={shopId} />}
              {view === "payouts" && <PayoutsView shopId={shopId} />}
              {view === "reviews" && <ReviewsView shopId={shopId} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
