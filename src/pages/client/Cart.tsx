import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../lib/utils';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, settings } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price_usd * item.quantity), 0);
  const total = subtotal + settings.delivery_fee;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-[var(--color-surface)] rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-[var(--color-text-secondary)]" />
        </div>
        <h2 className="text-2xl font-serif font-bold mb-2">Tu carrito está vacío</h2>
        <p className="text-[var(--color-text-secondary)] mb-8 max-w-md">
          Parece que aún no has agregado ningún producto a tu carrito. Explora nuestro catálogo y descubre las mejores opciones.
        </p>
        <Button size="lg" onClick={() => navigate('/home')}>
          Ir al Catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif font-bold mb-8">Tu Carrito</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.product.id} className="flex gap-4 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-black/20 shrink-0">
                <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">{item.product.presentation}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-destructive)] transition-colors p-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    Cant: <span className="font-medium text-[var(--color-text-primary)]">{item.quantity}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[var(--color-primary)]">
                      {formatCurrency(item.product.price_usd * item.quantity, 'USD')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-1">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 sticky top-24">
            <h3 className="text-lg font-bold mb-4">Resumen de Compra</h3>
            
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                <span>{formatCurrency(subtotal, 'USD')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Delivery</span>
                <span>{formatCurrency(settings.delivery_fee, 'USD')}</span>
              </div>
              
              <div className="border-t border-[var(--color-border)] pt-3 mt-3">
                <div className="flex justify-between items-end mb-1">
                  <span className="font-bold text-base">Total USD</span>
                  <span className="font-bold text-xl text-[var(--color-primary)]">{formatCurrency(total, 'USD')}</span>
                </div>
                <div className="flex justify-between items-end text-xs text-[var(--color-text-secondary)]">
                  <span>Total Bs (Tasa: {settings.exchange_rate})</span>
                  <span>{formatCurrency(total, 'BS', settings.exchange_rate)}</span>
                </div>
              </div>
            </div>

            <Button size="lg" className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/checkout')}>
              Proceder al Pago <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
