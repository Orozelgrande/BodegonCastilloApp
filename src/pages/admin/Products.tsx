import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Product } from '../../types';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    presentation: '',
    price_usd: 0,
    stock: 0,
    image_url: '',
    is_featured: false
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        brand: product.brand,
        category: product.category,
        presentation: product.presentation,
        price_usd: product.price_usd,
        stock: product.stock,
        image_url: product.image_url,
        is_featured: product.is_featured
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        brand: '',
        category: '',
        presentation: '',
        price_usd: 0,
        stock: 0,
        image_url: '',
        is_featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    handleCloseModal();
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif">Catálogo de Productos</h1>
        <Button className="flex items-center gap-2" onClick={() => handleOpenModal()}>
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
                      <Button variant="ghost" size="icon" title="Editar" onClick={() => handleOpenModal(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-[var(--color-destructive)] hover:text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10" title="Eliminar" onClick={() => handleDeleteClick(product.id)}>
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold font-serif mb-4">Confirmar Eliminación</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] sticky top-0 bg-[var(--color-surface)] z-10">
              <h2 className="text-xl font-bold font-serif">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre del Producto</label>
                  <Input 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Marca</label>
                  <Input 
                    required 
                    value={formData.brand} 
                    onChange={e => setFormData({...formData, brand: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoría</label>
                  <select 
                    className="w-full h-10 px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    required
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Seleccionar categoría...</option>
                    <option value="Whiskys">Whiskys</option>
                    <option value="Rones">Rones</option>
                    <option value="Cervezas">Cervezas</option>
                    <option value="Vodkas">Vodkas</option>
                    <option value="Vinos">Vinos</option>
                    <option value="Tequilas">Tequilas</option>
                    <option value="Ginebras">Ginebras</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Presentación</label>
                  <Input 
                    required 
                    placeholder="Ej: Botella 750ml"
                    value={formData.presentation} 
                    onChange={e => setFormData({...formData, presentation: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Precio (USD)</label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    required 
                    value={formData.price_usd} 
                    onChange={e => setFormData({...formData, price_usd: parseFloat(e.target.value)})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock Inicial</label>
                  <Input 
                    type="number" 
                    min="0" 
                    required 
                    value={formData.stock} 
                    onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">URL de la Imagen</label>
                  <Input 
                    required 
                    type="url"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={formData.image_url} 
                    onChange={e => setFormData({...formData, image_url: e.target.value})} 
                  />
                  {formData.image_url && (
                    <div className="mt-2 w-20 h-20 rounded-md overflow-hidden bg-black/20 border border-[var(--color-border)]">
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Error')} />
                    </div>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Descripción</label>
                  <textarea 
                    className="w-full min-h-[100px] px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y"
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2 flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                    className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium cursor-pointer">
                    Destacar producto en la página principal
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
