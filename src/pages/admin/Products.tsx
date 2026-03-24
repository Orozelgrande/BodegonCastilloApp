import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function Products() {
  const { products } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif">Catálogo de Productos</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)] w-16">Img</th>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Nombre</th>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Categoría</th>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Precio</th>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Stock</th>
                <th className="px-6 py-4 font-medium text-[var(--color-text-secondary)] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[var(--color-surface-hover)]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-black/20">
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">{product.brand} • {product.presentation}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{product.category}</Badge>
                  </td>
                  <td className="px-6 py-4 font-bold text-[var(--color-primary)]">
                    {formatCurrency(product.price_usd, 'USD')}
                  </td>
                  <td className="px-6 py-4">
                    {product.stock > 10 ? (
                      <Badge variant="success">{product.stock} unds</Badge>
                    ) : (
                      <Badge variant="warning">{product.stock} unds</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-[var(--color-destructive)] hover:text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10" title="Eliminar">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
