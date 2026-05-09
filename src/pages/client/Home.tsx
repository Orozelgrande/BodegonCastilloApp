import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../lib/utils';
import { ShoppingCart, Star, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';

export default function Home() {
  const { products, addToCart, settings } = useStore();
  const navigate = useNavigate();
  const categories = Array.from(new Set(products.map(p => p.category)));
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [addedProduct, setAddedProduct] = useState<Product | null>(null);

  const filteredProducts = selectedCategory === 'Todos' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const displayProducts = filteredProducts;

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedProduct(product);
  };

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Hero Banner */}
      <section className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80" 
          alt="Hero Banner" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-16 max-w-2xl">
          <span className="text-[var(--color-primary)] font-bold tracking-wider uppercase text-xs md:text-sm mb-2 md:mb-4">
            Selección Premium
          </span>
          <h1 className="font-serif text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Descubre los mejores Whiskys y Rones
          </h1>
          <Button size="lg" className="w-fit" onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}>
            Ver Catálogo
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section id="catalogo" className="scroll-mt-24">
        <h2 className="text-xl md:text-2xl font-bold mb-4 font-serif">Categorías</h2>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <button 
            onClick={() => setSelectedCategory('Todos')}
            className={`px-5 py-2 md:px-6 md:py-3 rounded-full border transition-colors whitespace-nowrap text-sm md:text-base font-medium ${selectedCategory === 'Todos' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 md:px-6 md:py-3 rounded-full border transition-colors whitespace-nowrap text-sm md:text-base font-medium ${selectedCategory === cat ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Catalog Products */}
      <section>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold font-serif flex items-center gap-2">
            Catálogo {selectedCategory !== 'Todos' && `- ${selectedCategory}`}
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {displayProducts.map((product) => (
            <div key={product.id} className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-primary)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-black/20">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.stock < 20 && (
                  <div className="absolute top-2 left-2 bg-[var(--color-destructive)] text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-md">
                    ¡Pocas unidades!
                  </div>
                )}
              </div>
              
              <div className="p-3 md:p-5 flex-1 flex flex-col">
                <div className="text-[10px] md:text-xs text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider line-clamp-1">{product.brand}</div>
                <h3 className="font-semibold text-sm md:text-lg mb-1 line-clamp-2 md:line-clamp-1" title={product.name}>{product.name}</h3>
                <p className="text-xs md:text-sm text-[var(--color-text-secondary)] mb-3 md:mb-4 line-clamp-1">{product.presentation}</p>
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-auto gap-2 sm:gap-0">
                  <div>
                    <div className="text-base md:text-xl font-bold text-[var(--color-primary)]">
                      {formatCurrency(product.price_usd, 'USD')}
                    </div>
                    <div className="text-[10px] md:text-xs text-[var(--color-text-secondary)] mt-0.5">
                      Ref: {formatCurrency(product.price_usd, 'BS', settings.exchange_rate)}
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={() => handleAddToCart(product)}
                    className="w-full sm:w-auto rounded-lg sm:rounded-full shadow-md shrink-0 sm:ml-2"
                    title="Agregar al carrito"
                  >
                    <ShoppingCart className="h-4 w-4 sm:mr-0 mr-2" />
                    <span className="sm:hidden text-xs">Agregar</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Added to Cart Modal */}
      {addedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl w-full max-w-md p-6 text-center">
            <div className="w-16 h-16 bg-[var(--color-success)]/20 text-[var(--color-success)] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">¡Añadido al carrito!</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Has agregado <span className="font-medium text-[var(--color-text-primary)]">{addedProduct.name}</span> a tu carrito de compras.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => setAddedProduct(null)} className="w-full sm:w-auto">
                Seguir Comprando
              </Button>
              <Button onClick={() => { setAddedProduct(null); navigate('/cart'); }} className="w-full sm:w-auto">
                Ir a Pagar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
