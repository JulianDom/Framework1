import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Client, ClientFormData } from '../types/client';

interface ClientFormProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClientFormData) => void;
}

export function ClientForm({ client, isOpen, onClose, onSave }: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    businessName: '',
    cuit: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    contactPerson: '',
    contactPhone: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormData, string>>>({});

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        businessName: client.businessName,
        cuit: client.cuit,
        email: client.email,
        phone: client.phone,
        address: client.address,
        city: client.city,
        country: client.country,
        contactPerson: client.contactPerson,
        contactPhone: client.contactPhone,
        isActive: client.isActive,
      });
    } else {
      setFormData({
        name: '',
        businessName: '',
        cuit: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        contactPerson: '',
        contactPhone: '',
        isActive: true,
      });
    }
    setErrors({});
  }, [client, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ClientFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'La razón social es requerida';
    }

    if (!formData.cuit.trim()) {
      newErrors.cuit = 'El CUIT es requerido';
    } else if (!/^\d{2}-\d{8}-\d{1}$/.test(formData.cuit) && !/^\d{11}$/.test(formData.cuit)) {
      newErrors.cuit = 'CUIT inválido (formato: XX-XXXXXXXX-X o 11 dígitos)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'El país es requerido';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'La persona de contacto es requerida';
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'El teléfono de contacto es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (field: keyof ClientFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-2xl mx-4 md:mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
          <DialogDescription>
            {client
              ? 'Modifica los datos del cliente existente'
              : 'Completa los datos para crear un nuevo cliente'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información General */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Información General</h4>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">
                  Razón Social <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  className={errors.businessName ? 'border-destructive' : ''}
                />
                {errors.businessName && (
                  <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                    {errors.businessName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuit">
                CUIT <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cuit"
                placeholder="XX-XXXXXXXX-X o 11 dígitos"
                value={formData.cuit}
                onChange={(e) => handleChange('cuit', e.target.value)}
                className={errors.cuit ? 'border-destructive' : ''}
              />
              {errors.cuit && (
                <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                  {errors.cuit}
                </p>
              )}
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Información de Contacto</h4>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Teléfono <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Dirección <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className={errors.address ? 'border-destructive' : ''}
              />
              {errors.address && (
                <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                  {errors.address}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">
                  Ciudad <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && (
                  <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                    {errors.city}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">
                  País <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className={errors.country ? 'border-destructive' : ''}
                />
                {errors.country && (
                  <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                    {errors.country}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Persona de Contacto */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Persona de Contacto</h4>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => handleChange('contactPerson', e.target.value)}
                  className={errors.contactPerson ? 'border-destructive' : ''}
                />
                {errors.contactPerson && (
                  <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                    {errors.contactPerson}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">
                  Teléfono <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  className={errors.contactPhone ? 'border-destructive' : ''}
                />
                {errors.contactPhone && (
                  <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                    {errors.contactPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base">
                Cliente Activo
              </Label>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                {formData.isActive
                  ? 'El cliente puede tener proyectos asociados'
                  : 'El cliente está deshabilitado en el sistema'}
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange('isActive', checked)}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="w-full md:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="w-full md:w-auto">
              {client ? 'Guardar Cambios' : 'Crear Cliente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}