import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CalendarDaysIcon,
  CogIcon,
  ListBulletIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  CalendarDaysIcon as CalendarDaysIconSolid,
  CogIcon as CogIconSolid,
  ListBulletIcon as ListBulletIconSolid,
  BookOpenIcon as BookOpenIconSolid
} from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  activeIcon: React.ComponentType<{ className?: string }>;
}

const navigation: NavigationItem[] = [
  {
    name: '首頁',
    href: '/',
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
  },
  {
    name: '行程列表',
    href: '/events',
    icon: ListBulletIcon,
    activeIcon: ListBulletIconSolid,
  },
  {
    name: '使用手冊',
    href: '/manual',
    icon: BookOpenIcon,
    activeIcon: BookOpenIconSolid,
  },
  {
    name: '設定',
    href: '/settings',
    icon: CogIcon,
    activeIcon: CogIconSolid,
  },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CalendarDaysIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                日曆管理系統
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = isActive ? item.activeIcon : item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

// 移動端導航組件
export function MobileNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-4 h-16">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = isActive ? item.activeIcon : item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors',
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600'
              )}
            >
              <Icon className="w-6 h-6" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}