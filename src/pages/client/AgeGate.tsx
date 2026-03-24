import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';

export default function AgeGate() {
  const { settings, setAgeVerified, isAgeVerified, currentUser, isAdmin } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAgeVerified) {
      if (currentUser) {
        navigate(isAdmin ? '/admin' : '/home');
      } else {
        navigate('/login');
      }
    }
  }, [isAgeVerified, currentUser, isAdmin, navigate]);

  const handleVerify = () => {
    setAgeVerified(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)] rounded-full mix-blend-screen filter blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-primary)] rounded-full mix-blend-screen filter blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-[var(--color-surface)]/80 backdrop-blur-xl border border-[var(--color-border)] rounded-2xl p-8 text-center relative z-10 shadow-2xl">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-[var(--color-primary)] mb-2">
            {settings.name}
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm tracking-widest uppercase">
            Premium Spirits & More
          </p>
        </div>

        <div className="space-y-6">
          <div className="text-5xl mb-4">🔞</div>
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            ¿Eres mayor de edad?
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
            Debes tener al menos 18 años para ingresar a este sitio. Al entrar, confirmas que cumples con la edad legal para consumir alcohol en tu país.
          </p>

          <div className="flex flex-col gap-3 mt-8">
            <Button size="lg" onClick={handleVerify} className="w-full text-lg font-semibold">
              Sí, soy mayor de edad
            </Button>
            <Button size="lg" variant="ghost" onClick={() => window.location.href = 'https://google.com'} className="w-full">
              No, salir del sitio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
