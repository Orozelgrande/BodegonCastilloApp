import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatCurrency } from '../../lib/utils';
import { CheckCircle2, UploadCloud, MapPin, Store } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default leaflet icons in React
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ location, setLocation }: { location: {lat: number, lng: number} | null, setLocation: (loc: {lat: number, lng: number}) => void }) {
  const map = useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });

  useEffect(() => {
    if (location) {
      map.flyTo(location, map.getZoom());
    }
  }, [location, map]);

  return location === null ? null : (
    <Marker position={location}></Marker>
  );
}

export default function Checkout() {
  const { cart, settings, placeOrder, currentUser } = useStore();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const [formData, setFormData] = useState({
    name: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    address: '',
    paymentMethod: 'pago_movil',
    reference: ''
  });

  const total = cart.reduce((sum, item) => sum + (item.product.price_usd * item.quantity), 0) + (deliveryType === 'delivery' ? settings.delivery_fee : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder(formData.name, formData.paymentMethod, formData.reference, deliveryType, formData.address, location || undefined);
    setStep(3); // Success step
  };

  useEffect(() => {
    // Try to get user location
    if (navigator.geolocation && !location) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation({ lat: 8.8872, lng: -64.1683 }) // Default San José de Guanipa
      );
    } else if (!location) {
        setLocation({ lat: 8.8872, lng: -64.1683 });
    }
  }, []);

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => alert("No se pudo obtener la ubicación. Por favor, verifica los permisos de tu navegador.")
      );
    } else {
      alert("La geolocalización no está soportada por tu navegador.");
    }
  };

  if (step === 3) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-20 h-20 bg-[var(--color-success)]/20 text-[var(--color-success)] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-serif font-bold mb-4">¡Pedido Recibido!</h2>
        <p className="text-[var(--color-text-secondary)] mb-8">
          Hemos recibido tu pedido y el comprobante de pago. Lo estamos verificando y pronto te notificaremos el estado {deliveryType === 'delivery' ? 'del despacho' : 'para el retiro'}.
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
          
          {/* Tipo de Entrega */}
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] flex items-center justify-center text-xs">1</span>
              Método de Entrega
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`p-4 border rounded-xl flex items-center gap-3 transition-colors ${
                  deliveryType === 'delivery' 
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]' 
                  : 'border-[var(--color-border)] hover:border-[var(--color-text-secondary)] text-[var(--color-text-secondary)]'
                }`}
              >
                <MapPin className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-bold">Delivery</div>
                  <div className="text-xs opacity-80">+ {formatCurrency(settings.delivery_fee, 'USD')}</div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`p-4 border rounded-xl flex items-center gap-3 transition-colors ${
                  deliveryType === 'pickup' 
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]' 
                  : 'border-[var(--color-border)] hover:border-[var(--color-text-secondary)] text-[var(--color-text-secondary)]'
                }`}
              >
                <Store className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-bold">Pick-up</div>
                  <div className="text-xs opacity-80">Gratis</div>
                </div>
              </button>
            </div>
          </section>

          <hr className="border-[var(--color-border)]" />

          {/* Datos del Cliente */}
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] flex items-center justify-center text-xs">2</span>
              Datos {deliveryType === 'delivery' ? 'de Envío' : 'del Cliente'}
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
              
              {deliveryType === 'delivery' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Dirección de Entrega</label>
                    <Input required={deliveryType === 'delivery'} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Av. Principal, Edificio X, Apto Y" />
                  </div>
                  <div>
                     <div className="flex items-center justify-between mb-2">
                       <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Ubicación en el Mapa (Opcional)</label>
                       <Button type="button" variant="outline" size="sm" onClick={handleUseMyLocation} className="text-xs h-8">
                         <MapPin className="w-3 h-3 mr-2" />
                         Usar mi ubicación
                       </Button>
                     </div>
                     <div className="h-64 rounded-xl overflow-hidden border border-[var(--color-border)] z-0 isolate">
                        {location && (
                          <MapContainer center={location} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker location={location} setLocation={setLocation} />
                          </MapContainer>
                        )}
                     </div>
                     <p className="text-xs text-[var(--color-text-secondary)] mt-2">Haz clic en el mapa para ajustar la ubicación de entrega.</p>
                  </div>
                </>
              )}
            </div>
          </section>

          <hr className="border-[var(--color-border)]" />

          {/* Método de Pago */}
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] flex items-center justify-center text-xs">3</span>
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
