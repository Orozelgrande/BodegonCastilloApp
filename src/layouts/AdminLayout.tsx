import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut, Users, Menu, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function AdminLayout() {
  const { settings, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: ShoppingBag, label: 'Pedidos', path: '/admin/orders' },
    { icon: Package, label: 'Productos', path: '/admin/products' },
    { icon: Users, label: 'Clientes', path: '/admin/clients' },
    { icon: Settings, label: 'Configuración', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-[var(--color-background)]">
      {/* Navigation Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r border-[var(--color-border)] bg-[var(--color-surface)] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-4 border-b border-[var(--color-border)] gap-3 bg-[var(--color-surface)] justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <img src="https://i.postimg.cc/1nY7LgxD/image.png" alt={settings.name} className="h-8 w-8 rounded-full object-cover border border-[var(--color-border)] shadow-sm" />
            <span className="font-serif text-sm font-bold text-[var(--color-primary)]">Admin Panel</span>
          </div>
          <button className="md:hidden text-[var(--color-text-secondary)] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] whitespace-nowrap" 
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] whitespace-nowrap"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-[var(--color-border)]">
          <button 
            onClick={async () => {
              try { await signOut(auth); } catch(e) {}
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-destructive)] transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Salir al Store
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center px-4 md:px-6 justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 -ml-2 text-[var(--color-text-secondary)] hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base md:text-lg font-semibold truncate leading-none mt-1">{settings.name} - Gestión</h1>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold text-xs md:text-sm">
              AD
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
