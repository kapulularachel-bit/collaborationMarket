export type UserRole = "seller" | "buyer" | "admin";

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled";
export type DeliveryStatus = "assigned" | "picked_up" | "in_transit" | "delivered" | "failed";
export type PayoutStatus = "pending" | "processing" | "paid" | "failed";
export type PromotionType = "percentage" | "fixed" | "bogo";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  university: string | null;
  residence: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Shop {
  id: string;
  seller_id: string;
  name: string;
  description: string;
  category: string;
  university: string;
  logo_url: string | null;
  banner_url: string | null;
  rating: number;
  total_sales: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  stock: number;
  is_available: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  shop_id: string;
  buyer_id: string;
  buyer_name: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  delivery_address: string;
  notes: string | null;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Delivery {
  id: string;
  order_id: string;
  order_number: string;
  buyer_name: string;
  delivery_address: string;
  status: DeliveryStatus;
  driver_name: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  created_at: string;
}

export interface Chat {
  id: string;
  shop_id: string;
  buyer_id: string;
  buyer_name: string;
  shop_name: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Promotion {
  id: string;
  shop_id: string;
  title: string;
  description: string;
  type: PromotionType;
  value: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

export interface Payout {
  id: string;
  seller_id: string;
  amount: number;
  status: PayoutStatus;
  period: string;
  created_at: string;
  paid_at: string | null;
}

export interface Review {
  id: string;
  shop_id: string;
  product_id: string | null;
  buyer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Billboard {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  position: number;
  is_active: boolean;
  starts_at: string;
  ends_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  created_at: string;
}
