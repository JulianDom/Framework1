import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Role, RoleFormData, Permission } from '../types/role';
import { ScrollArea } from './ui/scroll-area';

interface RoleFormProps {
  role: Role | null;
  permissions: Permission[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: RoleFormData) => void;
}

export function RoleForm({ role, permissions, isOpen, onClose, onSave }: RoleFormProps) {
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    permissions: [],
    isActive: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RoleFormData, string>>>({});

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isActive: role.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: [],
        isActive: true,
      });
    }
    setErrors({});
  }, [role, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RoleFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del rol es obligatorio';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = 'Debes asignar al menos un permiso';
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

  const handleChange = (field: keyof RoleFormData, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const togglePermission = (permissionId: string) => {
    setFormData((prev) => {
      const newPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId];
      return { ...prev, permissions: newPermissions };
    });
    if (errors.permissions) {
      setErrors((prev) => ({ ...prev, permissions: undefined }));
    }
  };

  const toggleCategoryPermissions = (category: string) => {
    const categoryPermissions = permissions
      .filter((p) => p.category === category)
      .map((p) => p.id);
    
    const allSelected = categoryPermissions.every((id) =>
      formData.permissions.includes(id)
    );

    if (allSelected) {
      // Deselect all in category
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.filter((id) => !categoryPermissions.includes(id)),
      }));
    } else {
      // Select all in category
      setFormData((prev) => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...categoryPermissions])],
      }));
    }
  };

  // Group permissions by category
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-2xl mx-4 md:mx-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{role ? 'Editar Rol' : 'Nuevo Rol'}</DialogTitle>
          <DialogDescription>
            {role
              ? 'Modifica el rol y sus permisos asignados'
              : 'Crea un nuevo rol y asigna los permisos correspondientes'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => {
                const allSelected = categoryPermissions.every((p) =>
                  formData.permissions.includes(p.id)
                );
                const someSelected = categoryPermissions.some((p) =>
                  formData.permissions.includes(p.id)
                );

                return (
                  <div key={category} className="space-y-3">
                    {/* Category header with select all */}
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{category}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCategoryPermissions(category)}
                        className="h-7 text-xs"
                      >
                        {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
                      </Button>
                    </div>

                    {/* Permissions in category */}
                    <div className="grid gap-3 pl-6">
                      {categoryPermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-start gap-3 rounded-md p-2 hover:bg-accent/50 transition-colors"
                        >
                          <Checkbox
                            id={permission.id}
                            checked={formData.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 space-y-0.5">
                            <Label
                              htmlFor={permission.id}
                              className="cursor-pointer text-foreground"
                            >
                              {permission.name}
                            </Label>
                            <p
                              className="text-muted-foreground leading-snug"
                              style={{ fontSize: 'var(--text-sm)' }}
                            >
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-border">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {role ? 'Guardar cambios' : 'Crear rol'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}