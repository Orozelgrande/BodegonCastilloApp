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
  setCurrentUser: (user: User | null) => void;
  setIsAdmin: (val: boolean) => void;
  setAgeVerified: (val: boolean) => void;
  setAdmin: (val: boolean) => void;
  login: (username: string, password?: string) => boolean;
  register: (user: Omit<User, 'id' | 'createdAt' | 'role'>) => boolean;
  logout: () => void;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (customerName: string, paymentMethod: string, reference: string, deliveryType: 'delivery' | 'pickup', address?: string, location?: {lat: number, lng: number}) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  updateSettings: (settings: Partial<TenantSettings>) => void;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Ron Santa Teresa Gran Reserva 750ml', description: 'Ron venezolano añejo de sabor suave, ideal para compartir o preparar cocteles.', brand: 'Santa Teresa', category: 'Rones', presentation: 'Botella 750ml', price_usd: 12.50, stock: 50, image_url: 'https://www.lavinia.com/media/catalog/product/s/a/santa-teresa-1796.jpeg', is_featured: true },
  { id: '2', name: 'Ron Diplomático Mantuano 750ml', description: 'Ron premium venezolano con notas dulces y amaderadas.', brand: 'Diplomático', category: 'Rones', presentation: 'Botella 750ml', price_usd: 18.00, stock: 50, image_url: 'https://www.rondiplomatico.com/wp-content/uploads/2022/03/ReservaExclusiva_678x1310px-600x1159.png', is_featured: true },
  { id: '3', name: 'Ron Cacique 500 750ml', description: 'Ron añejo venezolano de cuerpo medio y excelente relación calidad-precio.', brand: 'Cacique', category: 'Rones', presentation: 'Botella 750ml', price_usd: 14.00, stock: 50, image_url: 'https://www.vilaviniteca.es/media/catalog/product/v/0/v005984.jpg', is_featured: false },
  { id: '4', name: 'Ron Pampero Aniversario 750ml', description: 'Ron oscuro añejo con perfil intenso y elegante.', brand: 'Pampero', category: 'Rones', presentation: 'Botella 750ml', price_usd: 16.50, stock: 50, image_url: 'https://www.pampero.com/assets/img/rums-bg/Aniversario.png', is_featured: false },
  { id: '5', name: 'Ron Carupano Reserva 12 Años 750ml', description: 'Ron venezolano de alta gama con notas complejas y balanceadas.', brand: 'Carupano', category: 'Rones', presentation: 'Botella 750ml', price_usd: 21.00, stock: 50, image_url: 'https://images.unsplash.com/photo-1609345265499-2133bbeb6ce5?q=80&w=600&auto=format&fit=crop', is_featured: true },
  { id: '6', name: 'Whisky Old Parr 12 Años 750ml', description: 'Whisky escocés suave, muy popular para reuniones y regalos.', brand: 'Old Parr', category: 'Whiskys', presentation: 'Botella 750ml', price_usd: 32.00, stock: 50, image_url: 'https://img.thewhiskyexchange.com/330/blend_par12yo.jpg?v=202407241', is_featured: true },
  { id: '7', name: 'Whisky Buchanan\'s Deluxe 12 Años 750ml', description: 'Whisky escocés blended de sabor redondo y aroma refinado.', brand: 'Buchanan\'s', category: 'Whiskys', presentation: 'Botella 750ml', price_usd: 38.00, stock: 50, image_url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&q=80', is_featured: true },
  { id: '8', name: 'Whisky Johnnie Walker Red Label 750ml', description: 'Whisky blended escocés de sabor intenso, ideal para mezclar.', brand: 'Johnnie Walker', category: 'Whiskys', presentation: 'Botella 750ml', price_usd: 24.00, stock: 50, image_url: 'https://img.thewhiskyexchange.com/330/blend_joh2.jpg?v=202407241', is_featured: false },
  { id: '9', name: 'Whisky Johnnie Walker Black Label 750ml', description: 'Whisky escocés premium con notas ahumadas y gran equilibrio.', brand: 'Johnnie Walker', category: 'Whiskys', presentation: 'Botella 750ml', price_usd: 42.00, stock: 50, image_url: 'https://img.thewhiskyexchange.com/330/blend_joh1.jpg?v=202407241', is_featured: true },
  { id: '10', name: 'Whisky Something Special 750ml', description: 'Whisky escocés clásico, suave y de consumo popular.', brand: 'Something Special', category: 'Whiskys', presentation: 'Botella 750ml', price_usd: 19.50, stock: 50, image_url: 'https://www.liquorstore-online.com/product_images/p_145917.webp', is_featured: false },
  { id: '11', name: 'Vodka Absolut 750ml', description: 'Vodka importado de perfil limpio y versátil para coctelería.', brand: 'Absolut', category: 'Vodkas', presentation: 'Botella 750ml', price_usd: 19.00, stock: 50, image_url: 'https://img.thewhiskyexchange.com/330/vodka_abs1.jpg', is_featured: true },
  { id: '12', name: 'Vodka Smirnoff Red 750ml', description: 'Vodka tradicional de sabor neutro y excelente para mezclar.', brand: 'Smirnoff', category: 'Vodkas', presentation: 'Botella 750ml', price_usd: 11.50, stock: 50, image_url: 'https://img.thewhiskyexchange.com/330/vodka_smi1.jpg', is_featured: false },
  { id: '13', name: 'Vodka Grey Goose 750ml', description: 'Vodka francés premium de textura sedosa y acabado elegante.', brand: 'Grey Goose', category: 'Vodkas', presentation: 'Botella 750ml', price_usd: 48.00, stock: 50, image_url: 'https://img.thewhiskyexchange.com/330/vodka_gre1.jpg', is_featured: true },
  { id: '14', name: 'Vodka Stolichnaya 750ml', description: 'Vodka importado de alta pureza y sabor equilibrado.', brand: 'Stolichnaya', category: 'Vodkas', presentation: 'Botella 750ml', price_usd: 17.50, stock: 50, image_url: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?w=500&q=80', is_featured: false },
  { id: '15', name: 'Vodka Skyy 750ml', description: 'Vodka americano ideal para tragos largos y cocteles refrescantes.', brand: 'Skyy', category: 'Vodkas', presentation: 'Botella 750ml', price_usd: 13.00, stock: 50, image_url: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?w=500&q=80', is_featured: false },
  { id: '16', name: 'Gin Gordon\'s London Dry 750ml', description: 'Ginebra clásica con perfil seco y notas botánicas.', brand: 'Gordon\'s', category: 'Ginebras', presentation: 'Botella 750ml', price_usd: 15.00, stock: 50, image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80', is_featured: false },
  { id: '17', name: 'Gin Tanqueray 750ml', description: 'Ginebra premium de sabor seco y fresco, perfecta para gin tonic.', brand: 'Tanqueray', category: 'Ginebras', presentation: 'Botella 750ml', price_usd: 29.00, stock: 50, image_url: 'https://img.thewhiskyexchange.com/330/gin_tan1.jpg', is_featured: true },
  { id: '18', name: 'Gin Bombay Sapphire 750ml', description: 'Ginebra importada con notas botánicas delicadas y aroma elegante.', brand: 'Bombay Sapphire', category: 'Ginebras', presentation: 'Botella 750ml', price_usd: 31.00, stock: 50, image_url: 'https://img.thewhiskyexchange.com/330/gin_bom2.jpg?v=202407241', is_featured: true },
  { id: '19', name: 'Tequila Jose Cuervo Especial 750ml', description: 'Tequila joven ideal para shots y coctelería.', brand: 'Jose Cuervo', category: 'Tequilas', presentation: 'Botella 750ml', price_usd: 22.00, stock: 50, image_url: 'https://www.thebarreltap.com/cdn/shop/files/JoseCuervoEspecialGoldTequila750mL.webp?v=1755118379&width=700', is_featured: true },
  { id: '20', name: 'Tequila Olmeca Blanco 750ml', description: 'Tequila blanco suave con perfil fresco y cítrico.', brand: 'Olmeca', category: 'Tequilas', presentation: 'Botella 750ml', price_usd: 24.00, stock: 50, image_url: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?w=500&q=80', is_featured: false },
  { id: '21', name: 'Vino Tinto Casillero del Diablo Cabernet Sauvignon 750ml', description: 'Vino tinto chileno con notas frutales y cuerpo medio.', brand: 'Concha y Toro', category: 'Vinos', presentation: 'Botella 750ml', price_usd: 12.00, stock: 50, image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop', is_featured: true },
  { id: '22', name: 'Vino Tinto Santa Helena Merlot 750ml', description: 'Vino tinto suave y fácil de tomar, ideal para comidas.', brand: 'Santa Helena', category: 'Vinos', presentation: 'Botella 750ml', price_usd: 9.50, stock: 50, image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop', is_featured: false },
  { id: '23', name: 'Vino Blanco Frontera Chardonnay 750ml', description: 'Vino blanco fresco con notas tropicales y acidez balanceada.', brand: 'Frontera', category: 'Vinos', presentation: 'Botella 750ml', price_usd: 8.50, stock: 50, image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop', is_featured: false },
  { id: '24', name: 'Vino Espumoso Freixenet Cordon Negro 750ml', description: 'Espumoso seco ideal para celebraciones y brindis.', brand: 'Freixenet', category: 'Vinos', presentation: 'Botella 750ml', price_usd: 17.00, stock: 50, image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop', is_featured: true },
  { id: '25', name: 'Sangria Caroreña 1L', description: 'Bebida vínica venezolana dulce y refrescante.', brand: 'Caroreña', category: 'Vinos', presentation: 'Botella 1L', price_usd: 5.50, stock: 50, image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop', is_featured: false },
  { id: '26', name: 'Licor Baileys Original 750ml', description: 'Crema de whisky suave y dulce, ideal para postres o hielo.', brand: 'Baileys', category: 'Otros', presentation: 'Botella 750ml', price_usd: 23.00, stock: 50, image_url: 'https://www.lavinia.com/media/catalog/product/b/a/baileys-original.jpeg', is_featured: true },
  { id: '27', name: 'Licor Sheridan\'s 500ml', description: 'Licor de café y crema con presentación distintiva.', brand: 'Sheridan\'s', category: 'Otros', presentation: 'Botella 500ml', price_usd: 21.50, stock: 50, image_url: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=500&q=80', is_featured: false },
  { id: '28', name: 'Cerveza Polar Pilsen Lata 355ml', description: 'Cerveza venezolana ligera y refrescante.', brand: 'Polar', category: 'Cervezas', presentation: 'Lata 355ml', price_usd: 1.20, stock: 200, image_url: 'https://empresaspolar.com/wp-content/uploads/2022/04/Group-1757-2x.png', is_featured: true },
  { id: '29', name: 'Cerveza Polar Ice Lata 355ml', description: 'Cerveza rubia tipo lager de sabor suave y fresco.', brand: 'Polar', category: 'Cervezas', presentation: 'Lata 355ml', price_usd: 1.30, stock: 200, image_url: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=600&auto=format&fit=crop', is_featured: false },
  { id: '30', name: 'Cerveza Solera Verde 355ml', description: 'Cerveza premium venezolana de sabor balanceado.', brand: 'Solera', category: 'Cervezas', presentation: 'Botella 355ml', price_usd: 1.70, stock: 100, image_url: 'https://empresaspolar.com/wp-content/uploads/2022/05/Group-1657.png', is_featured: true },
  { id: '31', name: 'Cerveza Solera Azul 355ml', description: 'Cerveza de cuerpo más intenso con perfil elegante.', brand: 'Solera', category: 'Cervezas', presentation: 'Botella 355ml', price_usd: 1.90, stock: 100, image_url: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=600&auto=format&fit=crop', is_featured: false },
  { id: '32', name: 'Cerveza Heineken Lata 330ml', description: 'Cerveza importada lager con sabor limpio y ligero amargor.', brand: 'Heineken', category: 'Cervezas', presentation: 'Lata 330ml', price_usd: 1.80, stock: 150, image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Heineken_Bottle.jpg/500px-Heineken_Bottle.jpg', is_featured: true },
  { id: '33', name: 'Cerveza Corona 355ml', description: 'Cerveza mexicana ligera ideal para servir bien fría.', brand: 'Corona', category: 'Cervezas', presentation: 'Botella 355ml', price_usd: 2.20, stock: 150, image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Corona_Extra_beer_bottle_%282019%29.png/330px-Corona_Extra_beer_bottle_%282019%29.png', is_featured: true },
  { id: '34', name: 'Cerveza Modelo Especial 355ml', description: 'Cerveza tipo pilsner con sabor suave y final limpio.', brand: 'Modelo', category: 'Cervezas', presentation: 'Botella 355ml', price_usd: 2.30, stock: 100, image_url: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=600&auto=format&fit=crop', is_featured: false },
  { id: '35', name: 'Cerveza Zulia 355ml', description: 'Cerveza venezolana clásica de sabor refrescante.', brand: 'Zulia', category: 'Cervezas', presentation: 'Botella 355ml', price_usd: 1.25, stock: 100, image_url: 'https://static.wixstatic.com/media/526084_b3080112eb104c61bcfc2d48847d3408~mv2.png/v1/crop/x_0%2Cy_12%2Cw_472%2Ch_626/fill/w_295%2Ch_390%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/250%20ml%20no%20retornaba.png', is_featured: false },
  { id: '36', name: 'Refresco Coca-Cola 2L', description: 'Bebida gaseosa sabor cola en presentación familiar.', brand: 'Coca-Cola', category: 'Otros', presentation: 'Botella 2L', price_usd: 2.80, stock: 100, image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop', is_featured: true },
  { id: '37', name: 'Refresco Pepsi 2L', description: 'Bebida gaseosa sabor cola ideal para reuniones.', brand: 'Pepsi', category: 'Otros', presentation: 'Botella 2L', price_usd: 2.50, stock: 100, image_url: 'https://www.compra-aki.com/wp-content/uploads/2021/05/Refresco-de-Cola-Pepsi-2-L-1.jpg', is_featured: false },
  { id: '38', name: 'Refresco Chinotto 2L', description: 'Gaseosa de sabor intenso y tradicional en Venezuela.', brand: 'Chinotto', category: 'Otros', presentation: 'Botella 2L', price_usd: 2.60, stock: 100, image_url: 'https://www.compra-aki.com/wp-content/uploads/2021/05/Refresco-Limon-Chinotto-2-L.jpg', is_featured: false },
  { id: '39', name: 'Refresco Frescolita 2L', description: 'Gaseosa de sabor dulce y color rojizo muy popular.', brand: 'Frescolita', category: 'Otros', presentation: 'Botella 2L', price_usd: 2.70, stock: 100, image_url: 'https://tequechongos.com/wp-content/uploads/0013915-2-600x600.jpg', is_featured: false },
  { id: '40', name: 'Refresco Sprite 2L', description: 'Bebida gaseosa de lima-limon refrescante.', brand: 'Sprite', category: 'Otros', presentation: 'Botella 2L', price_usd: 2.60, stock: 100, image_url: 'https://www.compra-aki.com/wp-content/uploads/2021/05/Refresco-Limon-Sprite-2-L-1.jpg', is_featured: false },
  { id: '41', name: 'Agua Mineral Minalba 1.5L', description: 'Agua mineral ligera para consumo diario.', brand: 'Minalba', category: 'Otros', presentation: 'Botella 1.5L', price_usd: 1.20, stock: 100, image_url: 'https://caracas.tumania.com/wp-content/uploads/2020/09/minalbamineral15litros.png', is_featured: false },
  { id: '42', name: 'Agua Tónica Schweppes 1L', description: 'Mezclador clásico ideal para ginebra y cocteles.', brand: 'Schweppes', category: 'Otros', presentation: 'Botella 1L', price_usd: 2.40, stock: 100, image_url: 'https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202204/05/00118600800889____1__600x600.jpg', is_featured: false },
  { id: '43', name: 'Soda Canada Dry 1L', description: 'Bebida carbonatada perfecta para mezclar licores.', brand: 'Canada Dry', category: 'Otros', presentation: 'Botella 1L', price_usd: 2.30, stock: 100, image_url: 'https://caracas.tumania.com/wp-content/uploads/2020/09/canadadrygingerale1.5lcaam-min.jpg', is_featured: false },
  { id: '44', name: 'Ginger Ale Canada Dry 1L', description: 'Refresco tipo ginger ale ideal para whisky y cocteles.', brand: 'Canada Dry', category: 'Otros', presentation: 'Botella 1L', price_usd: 2.50, stock: 100, image_url: 'https://caracas.tumania.com/wp-content/uploads/2020/09/canadadrygingerale1.5lcaam-min.jpg', is_featured: false },
  { id: '45', name: 'Bebida Energética Red Bull 250ml', description: 'Bebida energizante de consumo individual.', brand: 'Red Bull', category: 'Otros', presentation: 'Lata 250ml', price_usd: 2.80, stock: 100, image_url: 'https://m.media-amazon.com/images/I/61mO-p-fFDL._SL1500_.jpg', is_featured: false },
  { id: '46', name: 'Bebida Energética Monster 473ml', description: 'Energizante de mayor contenido, ideal para consumo prolongado.', brand: 'Monster', category: 'Otros', presentation: 'Lata 473ml', price_usd: 3.50, stock: 100, image_url: 'https://m.media-amazon.com/images/I/71R2c8W1l1L._SL1500_.jpg', is_featured: false },
  { id: '47', name: 'Jugo de Naranja Del Valle 1L', description: 'Bebida sabor naranja lista para servir.', brand: 'Del Valle', category: 'Otros', presentation: 'Botella 1L', price_usd: 2.10, stock: 100, image_url: 'https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/201905/09/00118552100346____1__600x600.jpg', is_featured: false },
  { id: '48', name: 'Hielo Bolsa 2kg', description: 'Bolsa de hielo lista para enfriar bebidas y eventos.', brand: 'Genérico', category: 'Otros', presentation: 'Bolsa 2kg', price_usd: 1.80, stock: 50, image_url: 'https://theiceco.co.uk/wp-content/uploads/2021/09/Party-ice.jpg', is_featured: true },
  { id: '49', name: 'Papas Pringles Original 149g', description: 'Snack salado ideal para acompañar bebidas.', brand: 'Pringles', category: 'Snacks', presentation: 'Lata 149g', price_usd: 3.80, stock: 100, image_url: 'https://m.media-amazon.com/images/I/81xU2p6R7ML._SL1500_.jpg', is_featured: true },
  { id: '50', name: 'Mani Salado 200g', description: 'Snack clásico para compartir en reuniones y celebraciones.', brand: 'Genérico', category: 'Snacks', presentation: 'Bolsa 200g', price_usd: 1.90, stock: 100, image_url: 'https://m.media-amazon.com/images/I/71-05342a-L._SL1500_.jpg', is_featured: false },
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

      setCurrentUser: (user) => set({ currentUser: user }),
      setIsAdmin: (val) => set({ isAdmin: val }),
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

      updateCartQuantity: (productId: string, quantity: number) => set((state) => {
        if (quantity < 1) return state; // Don't allow less than 1, use removeFromCart to remove
        return {
          cart: state.cart.map(item => item.product.id === productId ? { ...item, quantity } : item)
        };
      }),
      
      clearCart: () => set({ cart: [] }),
      
      placeOrder: (customerName, paymentMethod, reference, deliveryType, address, location) => set((state) => {
        const total_usd = state.cart.reduce((sum, item) => sum + (item.product.price_usd * item.quantity), 0) + (deliveryType === 'delivery' ? state.settings.delivery_fee : 0);
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
          delivery_type: deliveryType,
          address,
          location,
        };
        return { orders: [newOrder, ...state.orders], cart: [] };
      }),

      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
      })),

      deleteOrder: (orderId) => set((state) => ({
        orders: state.orders.filter(o => o.id !== orderId)
      })),

      addProduct: (product) => set((state) => ({
        products: [{ ...product, id: `prod-${Math.floor(1000 + Math.random() * 9000)}` }, ...state.products]
      })),

      updateProduct: (id, product) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...product } : p)
      })),

      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),

      updateUser: (id, user) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, ...user } : u)
      })),

      deleteUser: (id) => set((state) => ({
        users: state.users.filter(u => u.id !== id)
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
    }),
    {
      name: 'bodegon-storage-v3',
    }
  )
);
