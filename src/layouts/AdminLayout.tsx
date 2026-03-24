import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut, Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export default function AdminLayout() {
  const { settings, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: ShoppingBag, label: 'Pedidos', path: '/admin/orders' },
    { icon: Package, label: 'Productos', path: '/admin/products' },
    { icon: Users, label: 'Clientes', path: '/admin/clients' },
    { icon: Settings, label: 'Configuración', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-[var(--color-background)]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--color-border)] bg-[var(--color-surface)] hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)]">
          <span className="font-serif text-lg font-bold text-[var(--color-primary)]">Admin Panel</span>
        </div>
        
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" 
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-[var(--color-border)]">
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-destructive)] transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Salir al Store
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center px-6 justify-between">
          <h1 className="text-lg font-semibold">{settings.name} - Gestión</h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold text-sm">
              AD
            </div>
          </div>
        </header>
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
