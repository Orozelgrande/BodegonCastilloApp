import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatCurrency } from '../../lib/utils';
import { CheckCircle2, UploadCloud } from 'lucide-react';

export default function Checkout() {
  const { cart, settings, placeOrder, currentUser } = useStore();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    address: '',
    paymentMethod: 'pago_movil',
    reference: ''
  });

  const total = cart.reduce((sum, item) => sum + (item.product.price_usd * item.quantity), 0) + settings.delivery_fee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder(formData.name, formData.paymentMethod, formData.reference);
    setStep(3); // Success step
  };

  if (step === 3) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-20 h-20 bg-[var(--color-success)]/20 text-[var(--color-success)] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-serif font-bold mb-4">¡Pedido Recibido!</h2>
        <p className="text-[var(--color-text-secondary)] mb-8">
          Hemos recibido tu pedido y el comprobante de pago. Lo estamos verificando y pronto te notificaremos el estado del despacho.
        </p>
        <Button onClick={() => navigate('/home')} className="w-full">
          Volver al Inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>
      
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Datos de Envío */}
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] flex items-center justify-center text-xs">1</span>
              Datos de Envío
            </h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Nombre Completo</label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej. Juan Pérez" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Teléfono</label>
                  <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="0414-1234567" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Dirección de Entrega</label>
                <Input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Av. Principal, Edificio X, Apto Y" />
              </div>
            </div>
          </section>

          <hr className="border-[var(--color-border)]" />

          {/* Método de Pago */}
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] flex items-center justify-center text-xs">2</span>
              Pago Manual
            </h3>
            
            <div className="bg-[var(--color-background)] p-4 rounded-lg border border-[var(--color-border)] mb-6">
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">Monto a pagar:</p>
              <div className="text-2xl font-bold text-[var(--color-primary)]">{formatCurrency(total, 'USD')}</div>
              <div className="text-sm text-[var(--color-text-secondary)]">Equivalente a {formatCurrency(total, 'BS', settings.exchange_rate)}</div>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Método de Pago</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  value={formData.paymentMethod}
                  onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                >
                  <option value="pago_movil">Pago Móvil (Banesco - 04141234567 - J456789012)</option>
                  <option value="transferencia">Transferencia Bancaria (Mercantil)</option>
                  <option value="zelle">Zelle (pagos@bodegon.com)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Número de Referencia</label>
                <Input required value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} placeholder="Últimos 6 dígitos" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Comprobante (Captura de pantalla)</label>
                <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-6 text-center hover:bg-[var(--color-background)] transition-colors cursor-pointer">
                  <UploadCloud className="h-8 w-8 mx-auto text-[var(--color-text-secondary)] mb-2" />
                  <p className="text-sm text-[var(--color-text-secondary)]">Haz clic para subir imagen o arrastra y suelta</p>
                  <p className="text-xs text-[var(--color-text-secondary)]/70 mt-1">PNG, JPG hasta 5MB</p>
                </div>
              </div>
            </div>
          </section>

          <Button type="submit" size="lg" className="w-full">
            Confirmar Pedido y Enviar Pago
          </Button>
        </form>
      </div>
    </div>
  );
}
