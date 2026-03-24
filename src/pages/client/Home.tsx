import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../lib/utils';
import { ShoppingCart, Star } from 'lucide-react';

export default function Home() {
  const { products, addToCart, settings } = useStore();
  const featuredProducts = products.filter(p => p.is_featured);
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="relative h-[400px] rounded-2xl overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80" 
          alt="Hero Banner" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 max-w-2xl">
          <span className="text-[var(--color-primary)] font-bold tracking-wider uppercase text-sm mb-4">
            Selección Premium
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Descubre los mejores Whiskys y Rones
          </h1>
          <Button size="lg" className="w-fit">
            Ver Catálogo
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-6 font-serif">Categorías</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button 
              key={cat}
              className="px-6 py-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors whitespace-nowrap font-medium"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
            <Star className="h-6 w-6 text-[var(--color-primary)] fill-[var(--color-primary)]" />
            Destacados
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-primary)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--color-primary)]/10">
              <div className="relative aspect-square overflow-hidden bg-black/20">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.stock < 20 && (
                  <div className="absolute top-3 left-3 bg-[var(--color-destructive)] text-white text-xs font-bold px-2 py-1 rounded-md">
                    ¡Pocas unidades!
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <div className="text-xs text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider">{product.brand}</div>
                <h3 className="font-semibold text-lg mb-1 line-clamp-1" title={product.name}>{product.name}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">{product.presentation}</p>
                
                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <div className="text-xl font-bold text-[var(--color-primary)]">
                      {formatCurrency(product.price_usd, 'USD')}
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                      Ref: {formatCurrency(product.price_usd, 'BS', settings.exchange_rate)}
                    </div>
                  </div>
                  
                  <Button 
                    size="icon" 
                    onClick={() => addToCart(product)}
                    className="rounded-full shadow-lg"
                    title="Agregar al carrito"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
