import { Settings, Save, Globe, Bell, Lock } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Card } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  SystemSettings, 
  languageOptions, 
  timezoneOptions, 
  dateFormatOptions,
  currencyOptions 
} from '../types/settings';

interface SettingsViewProps {
  onSave: (settings: SystemSettings) => void;
}

export function SettingsView({ onSave }: SettingsViewProps) {
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      systemName: 'Sistema de Relevamiento de Precios',
      systemEmail: 'admin@relevamientoprecios.com',
      systemPhone: '+54 11 1234-5678',
      defaultLanguage: 'es',
      timezone: 'America/Argentina/Buenos_Aires',
      dateFormat: 'DD/MM/YYYY',
      currency: 'ARS',
    },
    notifications: {
      emailNotifications: true,
      taskReminders: true,
      projectUpdates: true,
      systemAlerts: true,
    },
    security: {
      sessionTimeout: 30,
      passwordExpiration: 90,
      maxLoginAttempts: 5,
      twoFactorAuth: false,
    },
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleGeneralChange = (field: keyof typeof settings.general, value: string) => {
    setSettings((prev) => ({
      ...prev,
      general: { ...prev.general, [field]: value },
    }));
    setHasChanges(true);
  };

  const handleNotificationChange = (field: keyof typeof settings.notifications, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value },
    }));
    setHasChanges(true);
  };

  const handleSecurityChange = (field: keyof typeof settings.security, value: number | boolean) => {
    setSettings((prev) => ({
      ...prev,
      security: { ...prev.security, [field]: value },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(settings);
    setHasChanges(false);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Settings className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <h3>Configuración General</h3>
            <p className="text-muted-foreground text-sm">
              Ajusta los parámetros del sistema
            </p>
          </div>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} className="w-full md:w-auto gap-2">
            <Save className="h-4 w-4" />
            Guardar Cambios
          </Button>
        )}
      </div>

      {/* General Settings */}
      <Card className="p-4 md:p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Globe className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">Configuración General</h4>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="systemName">Nombre del Sistema</Label>
              <Input
                id="systemName"
                value={settings.general.systemName}
                onChange={(e) => handleGeneralChange('systemName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemEmail">Email del Sistema</Label>
              <Input
                id="systemEmail"
                type="email"
                value={settings.general.systemEmail}
                onChange={(e) => handleGeneralChange('systemEmail', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemPhone">Teléfono del Sistema</Label>
              <Input
                id="systemPhone"
                value={settings.general.systemPhone}
                onChange={(e) => handleGeneralChange('systemPhone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultLanguage">Idioma Predeterminado</Label>
              <Select
                value={settings.general.defaultLanguage}
                onValueChange={(value) => handleGeneralChange('defaultLanguage', value)}
              >
                <SelectTrigger id="defaultLanguage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Zona Horaria</Label>
              <Select
                value={settings.general.timezone}
                onValueChange={(value) => handleGeneralChange('timezone', value)}
              >
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezoneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFormat">Formato de Fecha</Label>
              <Select
                value={settings.general.dateFormat}
                onValueChange={(value) => handleGeneralChange('dateFormat', value)}
              >
                <SelectTrigger id="dateFormat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateFormatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select
                value={settings.general.currency}
                onValueChange={(value) => handleGeneralChange('currency', value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications Settings */}
      <Card className="p-4 md:p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Bell className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">Notificaciones</h4>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications" className="text-base">
                  Notificaciones por Email
                </Label>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Recibe actualizaciones importantes por correo electrónico
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.notifications.emailNotifications}
                onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
              <div className="space-y-0.5">
                <Label htmlFor="taskReminders" className="text-base">
                  Recordatorios de Tareas
                </Label>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Recibe alertas sobre tareas próximas a vencer
                </p>
              </div>
              <Switch
                id="taskReminders"
                checked={settings.notifications.taskReminders}
                onCheckedChange={(checked) => handleNotificationChange('taskReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
              <div className="space-y-0.5">
                <Label htmlFor="projectUpdates" className="text-base">
                  Actualizaciones de Proyectos
                </Label>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Notificaciones sobre cambios en proyectos
                </p>
              </div>
              <Switch
                id="projectUpdates"
                checked={settings.notifications.projectUpdates}
                onCheckedChange={(checked) => handleNotificationChange('projectUpdates', checked)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
              <div className="space-y-0.5">
                <Label htmlFor="systemAlerts" className="text-base">
                  Alertas del Sistema
                </Label>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Recibe notificaciones sobre el estado del sistema
                </p>
              </div>
              <Switch
                id="systemAlerts"
                checked={settings.notifications.systemAlerts}
                onCheckedChange={(checked) => handleNotificationChange('systemAlerts', checked)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-4 md:p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Lock className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">Seguridad</h4>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                min="5"
                max="120"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value) || 30)}
              />
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                Tiempo antes de cerrar sesión por inactividad
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordExpiration">Expiración de Contraseña (días)</Label>
              <Input
                id="passwordExpiration"
                type="number"
                min="30"
                max="365"
                value={settings.security.passwordExpiration}
                onChange={(e) => handleSecurityChange('passwordExpiration', parseInt(e.target.value) || 90)}
              />
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                Días antes de solicitar cambio de contraseña
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Máximo de Intentos de Login</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                min="3"
                max="10"
                value={settings.security.maxLoginAttempts}
                onChange={(e) => handleSecurityChange('maxLoginAttempts', parseInt(e.target.value) || 5)}
              />
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                Intentos permitidos antes de bloquear la cuenta
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="twoFactorAuth" className="text-base">
                Autenticación de Dos Factores
              </Label>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                Requiere verificación adicional al iniciar sesión
              </p>
            </div>
            <Switch
              id="twoFactorAuth"
              checked={settings.security.twoFactorAuth}
              onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
