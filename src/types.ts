export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  university: 'MUBAS' | 'MUST';
  residence: string;
  contact: string;
  isSeller: boolean;
  registrationDate: string;
}

export interface Shop {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  description: string;
  location: string;
  university: 'MUBAS' | 'MUST';
  rating: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number; // in MWK
  stock: number;
  images: string[];
  condition: 'Brand New' | 'Like New' | 'Gently Used' | 'Fair';
  isAvailable: boolean;
  shopId: string;
  sellerId: string;
  dateAdded: string;
  views: number;
  salesCount: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Accepted'
  | 'Preparing'
  | 'Ready for Delivery'
  | 'In Delivery'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';

export interface Order {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  sellerId: string;
  orderDate: string;
  price: number; // in MWK
  quantity: number;
  status: OrderStatus;
  deliveryLocation: string;
  university: 'MUBAS' | 'MUST';
  notes?: string;
  paymentStatus?: 'PAID' | 'REFUNDED' | 'PENDING';
  buyerPhone?: string;
}

export type DeliveryStatus =
  | 'Awaiting Seller Confirmation'
  | 'Preparing Order'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';

export interface Delivery {
  id: string;
  orderId: string;
  buyerName: string;
  buyerContact: string;
  sellerName: string;
  shopName: string;
  products: string; // text description
  deliveryLocation: string;
  university: 'MUBAS' | 'MUST';
  residence: string;
  contactNumber: string;
  preferredTime: string;
  notes: string;
  status: DeliveryStatus;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  productContext?: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

export interface Chat {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  sellerId: string;
  sellerName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  productId?: string;
}

export interface BillboardCampaign {
  id: string;
  title: string;
  headline: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  destinationLink: string;
  contentType: 'Featured Shop' | 'Featured Product' | 'Campus Deals' | 'Limited-Time Promotion' | 'University Announcement' | 'Seasonal Campaign' | 'Important GULA Notice';
  startDate: string;
  endDate: string;
  orderIndex: number;
  isActive: boolean;
}

export interface Promotion {
  id: string;
  productId: string;
  productName: string;
  discountPercent: number;
  expiryDate: string; // max 7 days
  isActive: boolean;
}
