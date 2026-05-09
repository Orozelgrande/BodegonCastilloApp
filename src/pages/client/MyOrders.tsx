import React from 'react';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Package } from 'lucide-react';

export default function MyOrders() {
  const { orders, currentUser } = useStore();
  
  if (!currentUser) return null;

  const myOrders = orders.filter(o => o.customer_id === currentUser.id).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold font-serif flex items-center gap-2">
        <Package className="h-6 w-6" /> Mis Pedidos
      </h1>

      {myOrders.length === 0 ? (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 text-center text-[var(--color-text-secondary)]">
          Aún no has realizado ningún pedido.
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map(order => (
            <div key={order.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[var(--color-border)]">
                <div>
                  <div className="text-sm text-[var(--color-text-secondary)]">Pedido #{order.id.substring(0, 8).toUpperCase()}</div>
                  <div className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-lg text-[var(--color-primary)]">{formatCurrency(order.total_usd, 'USD')}</div>
                  </div>
                  <Badge 
                    variant={
                      order.status === 'confirmed' ? 'success' :
                      order.status === 'pending_verification' ? 'warning' : 'outline'
                    }
                  >
                    {order.status === 'pending_verification' ? 'En verificación' : 
                     order.status === 'confirmed' ? 'Confirmado' : 
                     order.status === 'delivered' ? 'Entregado' : 
                     order.status === 'cancelled' ? 'Cancelado' : order.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-[var(--color-text-secondary)]">Productos</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-center font-medium">
                        {item.quantity}
                      </span>
                      <span>{item.product.name}</span>
                    </div>
                    <span>{formatCurrency(item.product.price_usd * item.quantity, 'USD')}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
