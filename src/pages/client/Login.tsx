import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { LogIn } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, settings } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(username, password);
    if (success) {
      const { isAdmin } = useStore.getState();
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
      <div className="max-w-md w-full bg-[var(--color-surface)] rounded-2xl p-8 border border-[var(--color-border)] shadow-xl">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-[var(--color-primary)] mb-2">
            {settings.name}
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Inicia sesión para continuar
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/20 text-[var(--color-destructive)] rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Usuario
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-primary)]"
              placeholder="Ingresa tu usuario"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-primary)]"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full mt-6" size="lg">
            <LogIn className="w-4 h-4 mr-2" />
            Iniciar Sesión
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-[var(--color-primary)] hover:underline font-medium">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
