import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Users, Search, Trash2, Edit, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User } from '../../types';

export default function Clients() {
  const { users, updateUser, deleteUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const clients = users.filter(u => u.role === 'client' && 
    (u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
     u.email.toLowerCase().includes(searchTerm.toLowerCase())));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<User | null>(null);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: ''
  });

  const handleOpenModal = (client: User) => {
    setEditingClient(client);
    setFormData({
      fullName: client.fullName,
      email: client.email,
      phone: client.phone,
      username: client.username
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      updateUser(editingClient.id, formData);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Clientes</h1>
          <p className="text-[var(--color-text-secondary)]">
            Gestiona los clientes registrados en la plataforma.
          </p>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder="Buscar clientes por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[var(--color-text-secondary)] uppercase bg-[var(--color-background)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Usuario</th>
                <th className="px-6 py-3">Contacto</th>
                <th className="px-6 py-3">Fecha de Registro</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[var(--color-text-secondary)]">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="h-12 w-12 mb-2 opacity-20" />
                      <p>No hay clientes encontrados.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-background)]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--color-text)]">{client.fullName}</div>
                      <div className="text-xs text-[var(--color-text-secondary)]">ID: {client.id}</div>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                      @{client.username}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[var(--color-text)]">{client.email}</div>
                      <div className="text-[var(--color-text-secondary)]">{client.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                      {new Date(client.createdAt).toLocaleDateString('es-VE')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Editar Cliente" onClick={() => handleOpenModal(client)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-[var(--color-destructive)] hover:text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10" 
                          title="Eliminar Cliente" 
                          onClick={() => setClientToDelete(client.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-serif">Editar Cliente</h2>
              <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">Nombre Completo</label>
                <Input 
                  required 
                  value={formData.fullName} 
                  onChange={e => setFormData({...formData, fullName: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">Usuario</label>
                <Input 
                  required 
                  disabled
                  value={formData.username} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">Email</label>
                <Input 
                  type="email"
                  required 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">Teléfono</label>
                <Input 
                  required 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {clientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <h2 className="text-xl font-bold font-serif mb-2">Eliminar Cliente</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.</p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setClientToDelete(null)}>
                Cancelar
              </Button>
              <Button 
                className="bg-[var(--color-destructive)] text-white hover:bg-[var(--color-destructive)]/90"
                onClick={() => {
                  deleteUser(clientToDelete);
                  setClientToDelete(null);
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
