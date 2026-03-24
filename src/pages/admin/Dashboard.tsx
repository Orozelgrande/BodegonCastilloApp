import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { orders, products } = useStore();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total_usd, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending_verification').length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;

  const data = [
    { name: 'Lun', ventas: 400 },
    { name: 'Mar', ventas: 300 },
    { name: 'Mié', ventas: 550 },
    { name: 'Jue', ventas: 200 },
    { name: 'Vie', ventas: 700 },
    { name: 'Sáb', ventas: 900 },
    { name: 'Dom', ventas: 850 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-serif">Dashboard</h1>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--color-text-secondary)] font-medium">Ingresos Totales</h3>
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalRevenue, 'USD')}</p>
          <p className="text-sm text-[var(--color-success)] mt-2 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" /> +12% vs mes anterior
          </p>
        </div>

        <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--color-text-secondary)] font-medium">Pedidos Pendientes</h3>
            <div className="w-10 h-10 rounded-full bg-[var(--color-warning)]/10 flex items-center justify-center text-[var(--color-warning)]">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold">{pendingOrders}</p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2">Requieren verificación</p>
        </div>

        <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--color-text-secondary)] font-medium">Stock Bajo</h3>
            <div className="w-10 h-10 rounded-full bg-[var(--color-destructive)]/10 flex items-center justify-center text-[var(--color-destructive)]">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold">{lowStockProducts}</p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2">Productos con menos de 10 uds</p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border)]">
        <h3 className="text-lg font-bold mb-6">Ventas de la Semana</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--color-text-secondary)" tick={{ fill: 'var(--color-text-secondary)' }} />
              <YAxis stroke="var(--color-text-secondary)" tick={{ fill: 'var(--color-text-secondary)' }} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                cursor={{ fill: 'var(--color-surface-hover)' }}
                contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--color-primary)' }}
              />
              <Bar dataKey="ventas" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
