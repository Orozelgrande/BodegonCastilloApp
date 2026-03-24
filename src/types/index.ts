export type OrderStatus = 'draft' | 'pending_payment' | 'pending_verification' | 'payment_rejected' | 'confirmed' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled';

export interface User {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'admin' | 'client';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  presentation: string;
  price_usd: number;
  stock: number;
  image_url: string;
  is_featured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customer_id?: string;
  customer_name: string;
  status: OrderStatus;
  total_usd: number;
  created_at: string;
  items: CartItem[];
  payment_method?: string;
  reference?: string;
}

export interface TenantSettings {
  name: string;
  logo_url: string;
  primary_color: string;
  exchange_rate: number;
  delivery_fee: number;
}
