import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { LogIn } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function Login() {
  const navigate = useNavigate();
  const { settings } = useStore();
  const [error, setError] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      useStore.getState().setCurrentUser({
        id: 'local-admin',
        username: 'admin',
        fullName: 'Administrador Local',
        email: 'admin@admin.com',
        phone: '',
        createdAt: new Date().toISOString(),
        role: 'admin',
      });
      useStore.getState().setIsAdmin(true);
      navigate('/admin');
    } else {
      setError('Credenciales incorrectas. Para administración manual usa admin / admin.');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The FirebaseAuthProvider will handle setting the user and navigating if necessary
      // Wait a moment for the auth state to settle, the global handler would navigate usually,
      // but let's just navigate to home
      navigate('/home');
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setError('Inicio de sesión cancelado.');
      } else {
        setError('Ocurrió un error al iniciar sesión con Google.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
      <div className="max-w-md w-full bg-[var(--color-surface)] rounded-2xl p-8 border border-[var(--color-border)] shadow-xl">
        <div className="text-center mb-8">
          <Link to="/home" className="inline-block mb-4">
            <img src="https://i.postimg.cc/1nY7LgxD/image.png" alt={settings.name} className="h-20 w-auto object-contain mx-auto" />
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[var(--color-primary)] mb-2">
            {settings.name}
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Inicia sesión usando Google
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/20 text-[var(--color-destructive)] rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <Button onClick={handleGoogleLogin} className="w-full mt-6" size="lg">
          <LogIn className="w-4 h-4 mr-2" />
          Iniciar Sesión con Google
        </Button>

        <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-4 text-center">
            Acceso Administrativo Manual
          </p>
          <form onSubmit={handleAdminLogin} className="space-y-4">
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
                placeholder="Usuario admin"
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
                placeholder="••••••"
              />
            </div>

            <Button type="submit" variant="outline" className="w-full" size="sm">
              <LogIn className="w-4 h-4 mr-2" />
              Entrar como Admin
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
