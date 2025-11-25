'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Package,
  CheckCircle
} from 'lucide-react';
import PushToggle from '@/components/providers/push-toggle';
import { Link } from 'next-view-transitions';
import OrderDetailButton from '@/components/orders/order-detail-button';

type DashboardResponse = {
  ok: boolean;
  data?: {
    stats: {
      totalOrders: number;
      confirmedOrders: number;
      eventsScheduled: number;
      receita30: number;
    };
    recentActivity: Array<{
      id: string;
      type: string;
      description: string;
      time: string;
      amount?: number;
      status: 'pending' | 'completed';
    }>;
  };
  error?: string;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
  const load = async () => {
      try {
    const res = await fetch('/api/dashboard', { cache: 'no-store' });
        const json: DashboardResponse = await res.json();
        if (!active) return;
        if (json.ok) {
          setData(json.data || null);
          setError(null);
        } else {
          setError(json.error || 'Falha ao carregar o dashboard');
        }
      } catch (e: any) {
        if (!active) return;
        setError(e?.message || 'Erro ao carregar');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const s = data?.stats;
    return [
      {
        title: 'Total de Pedidos',
        value: s ? String(s.totalOrders) : '—',
        description: 'Pedidos diretos criados',
        icon: ShoppingCart,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
      },
      {
        title: 'Receita (30 dias)',
        value: s ? s.receita30.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—',
        description: 'Somatório dos pedidos',
        icon: DollarSign,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
      },
      {
        title: 'Pedidos Confirmados',
        value: s ? String(s.confirmedOrders) : '—',
        description: 'Pedidos confirmados',
        icon: CheckCircle,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100',
      },
      {
        title: 'Eventos Agendados',
        value: s ? String(s.eventsScheduled) : '—',
        description: 'Próximos 30 dias',
        icon: Calendar,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
      },
    ];
  }, [data]);

  const recentActivity = data?.recentActivity ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {user?.username}! 👋
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Aqui está um resumo do seu negócio hoje.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <PushToggle />
          <Link 
            href="/encomenda" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Novo Pedido
          </Link>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon as any;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`h-8 w-8 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Atividade Recente
            </CardTitle>
            <CardDescription>
              Últimas atividades do seu negócio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && <div className="text-sm text-gray-500">Carregando...</div>}
            {!loading && recentActivity.length === 0 && (
              <div className="text-sm text-gray-500">Sem atividades ainda.</div>
            )}
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.time).toLocaleString('pt-BR')}
                  </p>
                </div>
                <OrderDetailButton
                  orderId={activity.id}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesse rapidamente as funcionalidades principais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
                <Link href="/encomenda" className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Novo Pedido
                  </span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>

              <Link href="/dashboard/calendar" className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Agendar Evento
                  </span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>

              <Link href="/dashboard/orders" className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Gerenciar Pedidos
                  </span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>

              <Link href="/dashboard/finances" className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-yellow-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Relatório Financeiro
                  </span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
