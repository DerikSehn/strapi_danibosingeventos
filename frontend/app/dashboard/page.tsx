'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Package,
  CheckCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Plus,
  FileText,
  Settings,
  Bell,
  Share
} from 'lucide-react';
import PushToggle from '@/components/providers/push-toggle';
import { Link } from 'next-view-transitions';
import OrderDetailButton from '@/components/orders/order-detail-button';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ShareOrderButton } from '@/components/dashboard/share-order-button';

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

type QuickActionsProps = (
  | {
      label: string;
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
      color: string;
      href: string;
      component?: never;
    }
  | {
      component: React.ReactNode;
      label?: never;
      icon?: never;
      color?: never;
      href?: never;
    }
)[];

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showBalance, setShowBalance] = useState(true);

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
    return {
      totalOrders: s ? String(s.totalOrders) : '—',
      receita30: s ? s.receita30 : 0,
      confirmedOrders: s ? String(s.confirmedOrders) : '—',
      eventsScheduled: s ? String(s.eventsScheduled) : '—',
    };
  }, [data]);

  const recentActivity = (data?.recentActivity ?? []).slice(0, 10);

  const quickActions: QuickActionsProps = [
    {
      component: <ShareOrderButton key="share-btn" />
    },
    {
      label: 'Novo Pedido',
      icon: Plus,
      href: '/encomenda',
      color: 'bg-primary-100 text-primary-600'
    },
    {
      label: 'Agendar',
      icon: Calendar,
      href: '/dashboard/calendar',
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Pedidos',
      icon: ShoppingCart,
      href: '/dashboard/orders',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Financeiro',
      icon: DollarSign,
      href: '/dashboard/finances',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      label: 'Clientes',
      icon: Users,
      href: '/dashboard/customers',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header Section - Bank Style */}
      <div className="bg-primary-500 text-white pt-8 pb-16 px-6 rounded-b-[2rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Package size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-secondary-100 text-sm font-medium">Olá,</p>
                <h1 className="text-xl font-bold">{user?.username || 'Visitante'}</h1>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Eye className="h-5 w-5" onClick={() => setShowBalance(!showBalance)} />
              </button>
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-secondary-100 text-sm mb-1">Receita (30 dias)</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold tracking-tight">
                {showBalance 
                  ? stats.receita30.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  : 'R$ ••••'
                }
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-20 space-y-6">
        {/* Quick Actions - Horizontal Scroll */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
            {quickActions.map((action, index) => {
              if (action.component) {
                return action.component;
              }
              
              // Type guard to ensure href, label, icon, color exist
              if (!action.href || !action.label || !action.icon) return null;

              return (
                <Link 
                  key={action.label} 
                  href={action.href}
                  className="flex flex-col items-center gap-2 min-w-[72px]"
                >
                  <div className={cn("h-14 w-14 rounded-full flex items-center justify-center transition-transform active:scale-95", action.color)}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 text-center leading-tight">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Secondary Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-blue-50 border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2 text-blue-600">
                <ShoppingCart className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">Pedidos</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              <p className="text-xs text-gray-500">Total registrado</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2 text-orange-600">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">Eventos</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.eventsScheduled}</p>
              <p className="text-xs text-gray-500">Agendados</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-gray-900">Atividade Recente</h3>
            <Link href="/dashboard/orders" className="text-sm text-secondary-600 font-medium flex items-center gap-1">
              Ver tudo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Carregando...</div>
            ) : recentActivity.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhuma atividade recente</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        activity.status === 'completed' ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                      )}>
                        {activity.type === 'Pedido' ? <ShoppingCart className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.time).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {activity.amount && (
                        <span className={cn(
                          "font-semibold text-sm",
                          activity.status === 'completed' ? "text-green-600" : "text-gray-900"
                        )}>
                          {activity.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      )}
                      <OrderDetailButton orderId={activity.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
