import React from 'react';
import Navigation, { MobileNavigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 桌面端導航 */}
      <div className="hidden md:block">
        <Navigation />
      </div>
      
      {/* 主要內容 */}
      <main className="pb-16 md:pb-0">
        {children}
      </main>
      
      {/* 移動端導航 */}
      <MobileNavigation />
    </div>
  );
}