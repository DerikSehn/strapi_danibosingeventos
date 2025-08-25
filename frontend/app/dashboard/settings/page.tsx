'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Palette,
  Globe,
  Database,
  Save
} from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      marketing: false,
    },
    appearance: {
      theme: 'light',
      language: 'pt-BR',
    },
    business: {
      businessName: 'Dani Bosing Eventos',
      phone: '',
      address: '',
    },
  });

  const handleSave = () => {
    // Implementation will be added when backend endpoints are ready
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="mt-1 text-sm text-gray-600">
          Gerencie suas preferências e configurações do sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como você deseja receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Notificações por E-mail</Label>
                <p className="text-sm text-gray-600">
                  Receba atualizações importantes por e-mail
                </p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked: boolean) =>
                  setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, email: checked }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Notificações Push</Label>
                <p className="text-sm text-gray-600">
                  Receba notificações no navegador
                </p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(checked: boolean) =>
                  setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, push: checked }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">E-mails de Marketing</Label>
                <p className="text-sm text-gray-600">
                  Receba dicas e novidades sobre o negócio
                </p>
              </div>
              <Switch
                checked={settings.notifications.marketing}
                onCheckedChange={(checked: boolean) =>
                  setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, marketing: checked }
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-600" />
              Aparência
            </CardTitle>
            <CardDescription>
              Personalize a aparência da sua interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <select
                id="theme"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.appearance.theme}
                onChange={(e) =>
                  setSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, theme: e.target.value }
                  }))
                }
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="system">Sistema</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <select
                id="language"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.appearance.language}
                onChange={(e) =>
                  setSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, language: e.target.value }
                  }))
                }
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              Informações do Negócio
            </CardTitle>
            <CardDescription>
              Configure as informações da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nome do Negócio</Label>
              <Input
                id="businessName"
                value={settings.business.businessName}
                onChange={(e) =>
                  setSettings(prev => ({
                    ...prev,
                    business: { ...prev.business, businessName: e.target.value }
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                value={settings.business.phone}
                onChange={(e) =>
                  setSettings(prev => ({
                    ...prev,
                    business: { ...prev.business, phone: e.target.value }
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="Rua, número, bairro, cidade"
                value={settings.business.address}
                onChange={(e) =>
                  setSettings(prev => ({
                    ...prev,
                    business: { ...prev.business, address: e.target.value }
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-orange-600" />
              Sistema
            </CardTitle>
            <CardDescription>
              Configurações avançadas do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Backup de Dados</h4>
                <p className="text-sm text-gray-600">
                  Faça backup dos seus dados regularmente
                </p>
              </div>
              <Button variant="outline" size="sm">
                Fazer Backup
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Exportar Dados</h4>
                <p className="text-sm text-gray-600">
                  Baixe uma cópia dos seus dados
                </p>
              </div>
              <Button variant="outline" size="sm">
                Exportar
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Logs de Sistema</h4>
                <p className="text-sm text-gray-600">
                  Visualize os logs de atividade do sistema
                </p>
              </div>
              <Button variant="outline" size="sm">
                Ver Logs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Card>
          <CardContent className="pt-6">
            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Salvar Todas as Configurações
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
