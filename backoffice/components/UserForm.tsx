import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { User, UserFormData } from '../types/user';

interface UserFormProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UserFormData) => void;
}

export function UserForm({ user, isOpen, onClose, onSave }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    username: '',
    email: '',
    role: 'Relevador',
    isActive: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });
    } else {
      setFormData({
        name: '',
        username: '',
        email: '',
        role: 'Relevador',
        isActive: true,
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.role) {
      newErrors.role = 'El rol es obligatorio';
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

  const handleChange = (field: keyof UserFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-4 md:mx-auto">
        <DialogHeader>
          <DialogTitle>{user ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
          <DialogDescription>
            {user
              ? 'Modifica los datos del usuario operativo'
              : 'Completa los datos para crear un nuevo usuario operativo'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre completo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ej: Juan Pérez"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">
              Nombre de usuario <span className="text-destructive">*</span>
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="Ej: jperez"
              className={errors.username ? 'border-destructive' : ''}
            />
            {errors.username && (
              <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                {errors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Correo electrónico <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Ej: jperez@empresa.com"
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">
              Rol <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
              <SelectTrigger id="role" className={errors.role ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Relevador">Relevador</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Coordinador">Coordinador</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                {errors.role}
              </p>
            )}
          </div>

          {/* Active status */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="active" className="cursor-pointer">
                Usuario activo
              </Label>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                {formData.isActive
                  ? 'El usuario puede acceder al sistema'
                  : 'El usuario no puede acceder al sistema'}
              </p>
            </div>
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange('isActive', checked)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {user ? 'Guardar cambios' : 'Crear usuario'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}