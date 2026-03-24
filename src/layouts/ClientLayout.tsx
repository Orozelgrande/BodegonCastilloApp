import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, LogOut, ShieldAlert } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';

export default function ClientLayout() {
  const { settings, cart, currentUser, isAdmin, logout } = useStore();
  const navigate = useNavigate();
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/home" className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-[var(--color-primary)]">
                {settings.name}
              </span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--color-text-secondary)]" />
              <input
                type="search"
                placeholder="Buscar whiskys, rones..."
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/cart')} className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-[10px] font-bold flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>
            
            {currentUser ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Button variant="ghost" size="icon" onClick={() => navigate('/admin')} title="Panel de Admin">
                    <ShieldAlert className="h-5 w-5 text-[var(--color-primary)]" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Cerrar Sesión">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => navigate('/login')} title="Iniciar Sesión">
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-[var(--color-text-secondary)] text-sm">
          <p>© {new Date().getFullYear()} {settings.name}. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs opacity-50">Desarrollado con arquitectura Multi-Tenant.</p>
        </div>
      </footer>
    </div>
  );
}
