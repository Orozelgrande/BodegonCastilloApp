import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Eye, CheckCircle, XCircle, Truck } from 'lucide-react';
import { OrderStatus } from '../../types';

export default function Orders() {
  const { orders, updateOrderStatus } = useStore();
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_verification': return <Badge variant="warning">Por Verificar</Badge>;
      case 'confirmed': return <Badge variant="success">Confirmado</Badge>;
      case 'preparing': return <Badge variant="outline">En Preparación</Badge>;
      case 'dispatched': return <Badge variant="outline">Despachado</Badge>;
      case 'delivered': return <Badge variant="success">Entregado</Badge>;
      case 'payment_rejected': return <Badge variant="danger">Pago Rechazado</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif">Gestión de Pedidos</h1>
        <div className="flex gap-2">
          <select 
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">Todos los pedidos</option>
            <option value="pending_verification">Por Verificar</option>
            <option value="confirmed">Confirmados</option>
            <option value="preparing">En Preparación</option>
            <option value="dispatched">Despachados</option>
            <option value="delivered">Entregados</option>
          </select>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">ID Pedido</th>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Cliente</th>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Fecha</th>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Total</th>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Estado</th>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[var(--color-surface-hover)]/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{order.id}</td>
                  <td className="px-6 py-4">{order.customer_name}</td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-[var(--color-primary)]">
                    {formatCurrency(order.total_usd, 'USD')}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Ver Detalle">
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {order.status === 'pending_verification' && (
                        <>
                          <Button variant="ghost" size="icon" className="text-[var(--color-success)] hover:text-[var(--color-success)] hover:bg-[var(--color-success)]/10" title="Aprobar Pago" onClick={() => updateOrderStatus(order.id, 'confirmed')}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-[var(--color-destructive)] hover:text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10" title="Rechazar Pago" onClick={() => updateOrderStatus(order.id, 'payment_rejected')}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {order.status === 'confirmed' && (
                        <Button variant="outline" size="sm" onClick={() => updateOrderStatus(order.id, 'preparing')}>
                          Preparar
                        </Button>
                      )}
                      
                      {order.status === 'preparing' && (
                        <Button variant="outline" size="sm" onClick={() => updateOrderStatus(order.id, 'dispatched')}>
                          <Truck className="h-4 w-4 mr-2" /> Despachar
                        </Button>
                      )}
                      
                      {order.status === 'dispatched' && (
                        <Button variant="outline" size="sm" onClick={() => updateOrderStatus(order.id, 'delivered')}>
                          Entregar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--color-text-secondary)]">
                    No se encontraron pedidos con este estado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
