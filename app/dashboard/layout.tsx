'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Smartphone, 
  UserCog, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const menuItems = [
    { name: 'لوحة التحكم', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'العملاء', icon: Users, path: '/dashboard/customers' },
    { name: 'الأجهزة', icon: Smartphone, path: '/dashboard/devices' },
    ...(profile?.role === 'admin' ? [{ name: 'المستخدمين', icon: UserCog, path: '/dashboard/users' }] : []),
    { name: 'الإعدادات', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 right-0 z-50 bg-white border-l border-slate-200 transition-all duration-300 ease-in-out shadow-sm",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-bottom border-slate-100">
            {isSidebarOpen && (
              <span className="font-bold text-xl text-indigo-600 truncate">إدارة النظام</span>
            )}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                    isActive 
                      ? "bg-indigo-50 text-indigo-600" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon size={22} className={cn(isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                  {isSidebarOpen && (
                    <span className="font-medium whitespace-nowrap">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-slate-100">
            {isSidebarOpen && (
              <div className="mb-4 px-2">
                <p className="text-sm font-semibold text-slate-900 truncate">{profile?.email}</p>
                <p className="text-xs text-slate-500 capitalize">{profile?.role === 'admin' ? 'مدير النظام' : 'مستخدم'}</p>
              </div>
            )}
            <button
              onClick={signOut}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all",
                !isSidebarOpen && "justify-center"
              )}
            >
              <LogOut size={22} />
              {isSidebarOpen && <span className="font-medium">تسجيل الخروج</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300",
          isSidebarOpen ? "mr-64" : "mr-20"
        )}
      >
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
