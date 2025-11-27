'use client';

import { useAuth } from '@/lib/hooks/use-auth';
import { logoutAction } from '../../data/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { 
  Home,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChefHat,
  Package
} from 'lucide-react';
import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Início', href: '/dashboard', icon: Home },
  { name: 'Pedidos', href: '/dashboard/orders', icon: Package },
  { name: 'Perfil', href: '/dashboard/profile', icon: User },
  { name: 'Ajustes', href: '/dashboard/settings', icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      
      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-neutral-50 shadow-md border-r border-gray-200">
            <SidebarContent pathname={pathname} onLogout={handleLogout} user={user} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden h-[100dvh]">
        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none pb-20 lg:pb-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
        <div className="flex justify-around items-center h-16 pb-safe">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center w-full h-full space-y-1',
                  isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                )}
              >
                <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SidebarContent({ 
  pathname, 
  onLogout, 
  user 
}: { 
  pathname: string; 
  onLogout: () => void;
  user: any;
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center flex-shrink-0 px-4 py-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <ChefHat className="h-8 w-8 text-orange-600" />
          <span className="text-xl font-bold text-gray-900">Dani Bosing</span>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <User className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">
              {user?.username || 'Usuário'}
            </p>
            <p className="text-xs text-gray-500">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-orange-100 text-orange-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon
                className={cn(
                  'mr-3 h-5 w-5 transition-colors',
                  isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="px-2 py-4 border-t border-gray-200">
        <Button
          onClick={onLogout}
          variant="outline"
          size="sm"
          className="w-full justify-start text-gray-600 hover:text-gray-900"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sair
        </Button>
      </div>
    </>
  );
}
