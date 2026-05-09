import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Eye, CheckCircle, XCircle, Truck, X, Trash2 } from 'lucide-react';
import { OrderStatus, Order } from '../../types';

export default function Orders() {
  const { orders, updateOrderStatus, settings, deleteOrder } = useStore();
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

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
                      <Button variant="ghost" size="icon" title="Ver Detalle" onClick={() => setSelectedOrder(order)}>
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

                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-[var(--color-destructive)] hover:text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10" 
                        title="Eliminar Pedido" 
                        onClick={() => setOrderToDelete(order.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] sticky top-0 bg-[var(--color-surface)] z-10">
              <h2 className="text-xl font-bold font-serif">
                Detalles del Pedido: {selectedOrder.id}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[var(--color-text-secondary)] mb-1">Cliente</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)] mb-1">Fecha</p>
                  <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)] mb-1">Estado</p>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)] mb-1">Total</p>
                  <p className="font-bold text-[var(--color-primary)]">{formatCurrency(selectedOrder.total_usd, 'USD')}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{formatCurrency(selectedOrder.total_usd, 'BS', settings.exchange_rate)}</p>
                </div>
              </div>

              <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-background)]">
                <h3 className="font-medium mb-3">Información de Pago</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[var(--color-text-secondary)] mb-1">Método</p>
                    <p className="font-medium">{selectedOrder.payment_method || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-[var(--color-text-secondary)] mb-1">Referencia</p>
                    <p className="font-medium font-mono">{selectedOrder.reference || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 border-b border-[var(--color-border)] pb-2">Productos ({selectedOrder.items.reduce((acc, item) => acc + item.quantity, 0)})</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded bg-black/10 overflow-hidden flex-shrink-0">
                        <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">{item.quantity}x {formatCurrency(item.product.price_usd, 'USD')}</p>
                      </div>
                      <div className="font-bold text-right">
                        {formatCurrency(item.product.price_usd * item.quantity, 'USD')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedOrder.status === 'pending_verification' && (
                <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
                  <Button 
                    className="flex-1 bg-[var(--color-success)] hover:bg-[var(--color-success)]/90 text-white"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'confirmed');
                      setSelectedOrder(null);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" /> Aprobar Pago
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-[var(--color-destructive)] border-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'payment_rejected');
                      setSelectedOrder(null);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Rechazar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <h2 className="text-xl font-bold font-serif mb-2">Eliminar Pedido</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.</p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setOrderToDelete(null)}>
                Cancelar
              </Button>
              <Button 
                className="bg-[var(--color-destructive)] text-white hover:bg-[var(--color-destructive)]/90"
                onClick={() => {
                  deleteOrder(orderToDelete);
                  setOrderToDelete(null);
                }}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
