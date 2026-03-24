import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, Order, TenantSettings, OrderStatus, User } from '../types';

interface AppState {
  settings: TenantSettings;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  users: User[];
  currentUser: User | null;
  isAgeVerified: boolean;
  isAdmin: boolean;
  
  // Actions
  setAgeVerified: (val: boolean) => void;
  setAdmin: (val: boolean) => void;
  login: (username: string, password?: string) => boolean;
  register: (user: Omit<User, 'id' | 'createdAt' | 'role'>) => boolean;
  logout: () => void;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (customerName: string, paymentMethod: string, reference: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: "Buchanan's 12 Años Deluxe", description: "Whisky escocés de mezcla premium.", brand: "Buchanan's", category: 'Whiskys', presentation: 'Botella 750ml', price_usd: 35.00, stock: 24, image_url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&q=80', is_featured: true },
  { id: '2', name: 'Santa Teresa 1796', description: 'Ron súper premium método Solera.', brand: 'Santa Teresa', category: 'Rones', presentation: 'Botella 750ml', price_usd: 45.00, stock: 15, image_url: 'https://images.unsplash.com/photo-1614315584648-9141b61c1b5a?w=500&q=80', is_featured: true },
  { id: '3', name: 'Polar Pilsen (Caja 36)', description: 'La cerveza tradicional venezolana.', brand: 'Polar', category: 'Cervezas', presentation: 'Caja 36x222ml', price_usd: 22.00, stock: 50, image_url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500&q=80', is_featured: true },
  { id: '4', name: 'Grey Goose', description: 'Vodka francés premium.', brand: 'Grey Goose', category: 'Vodkas', presentation: 'Botella 750ml', price_usd: 45.00, stock: 10, image_url: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?w=500&q=80', is_featured: false },
  { id: '5', name: 'Casillero del Diablo Cabernet', description: 'Vino tinto chileno.', brand: 'Concha y Toro', category: 'Vinos', presentation: 'Botella 750ml', price_usd: 10.00, stock: 30, image_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=500&q=80', is_featured: false },
  { id: '6', name: 'Johnnie Walker Black Label', description: 'El icónico whisky de mezcla.', brand: 'Johnnie Walker', category: 'Whiskys', presentation: 'Botella 750ml', price_usd: 38.00, stock: 18, image_url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&q=80', is_featured: true },
];

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-1024', customer_name: 'Juan Pérez', status: 'pending_verification', total_usd: 57.00, created_at: new Date().toISOString(), items: [{ product: MOCK_PRODUCTS[0], quantity: 1 }, { product: MOCK_PRODUCTS[2], quantity: 1 }], payment_method: 'Pago Móvil', reference: '123456' },
  { id: 'ORD-1023', customer_name: 'María Gómez', status: 'delivered', total_usd: 45.00, created_at: new Date(Date.now() - 86400000).toISOString(), items: [{ product: MOCK_PRODUCTS[1], quantity: 1 }], payment_method: 'Zelle', reference: 'Z-987' },
];

const INITIAL_ADMIN: User = {
  id: 'admin-1',
  username: 'admin',
  password: 'admin',
  fullName: 'Administrador',
  email: 'admin@bodegon.com',
  phone: '0000000000',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      settings: {
        name: "Bodegón D' Castillo",
        logo_url: "https://i.imgur.com/placeholder_logo.png",
        primary_color: "#DA992D",
        exchange_rate: 36.50,
        delivery_fee: 3.00,
      },
      products: MOCK_PRODUCTS,
      cart: [],
      orders: MOCK_ORDERS,
      users: [INITIAL_ADMIN],
      currentUser: null,
      isAgeVerified: false,
      isAdmin: false,

      setAgeVerified: (val) => set({ isAgeVerified: val }),
      setAdmin: (val) => set({ isAdmin: val }),
      
      login: (username, password) => {
        const { users } = get();
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          set({ currentUser: user, isAdmin: user.role === 'admin' });
          return true;
        }
        return false;
      },

      register: (userData) => {
        const { users } = get();
        if (users.some(u => u.username === userData.username)) {
          return false; // Username already exists
        }
        
        const newUser: User = {
          ...userData,
          id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
          role: 'client',
          createdAt: new Date().toISOString(),
        };
        
        set({ 
          users: [...users, newUser],
          currentUser: newUser,
          isAdmin: false
        });
        return true;
      },

      logout: () => set({ currentUser: null, isAdmin: false }),
      
      addToCart: (product, qty = 1) => set((state) => {
        const existing = state.cart.find(item => item.product.id === product.id);
        if (existing) {
          return { cart: state.cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item) };
        }
        return { cart: [...state.cart, { product, quantity: qty }] };
      }),
      
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.product.id !== productId)
      })),
      
      clearCart: () => set({ cart: [] }),
      
      placeOrder: (customerName, paymentMethod, reference) => set((state) => {
        const total_usd = state.cart.reduce((sum, item) => sum + (item.product.price_usd * item.quantity), 0) + state.settings.delivery_fee;
        const newOrder: Order = {
          id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          customer_id: state.currentUser?.id,
          customer_name: customerName,
          status: 'pending_verification',
          total_usd,
          created_at: new Date().toISOString(),
          items: [...state.cart],
          payment_method: paymentMethod,
          reference,
        };
        return { orders: [newOrder, ...state.orders], cart: [] };
      }),

      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
      })),
    }),
    {
      name: 'bodegon-storage',
    }
  )
);
