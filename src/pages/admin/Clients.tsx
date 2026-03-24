import { useStore } from '../../store/useStore';
import { Users, Search } from 'lucide-react';

export default function Clients() {
  const { users } = useStore();
  const clients = users.filter(u => u.role === 'client');

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
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[var(--color-text-secondary)]">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="h-12 w-12 mb-2 opacity-20" />
                      <p>No hay clientes registrados todavía.</p>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
