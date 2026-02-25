'use client';

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  Globe, 
  Palette,
  Database,
  Shield,
  ChevronLeft,
  Mail
} from 'lucide-react';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import UpdateEmailModal from '@/components/UpdateEmailModal';
import { useAuth } from '@/components/AuthProvider';

export default function SettingsPage() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const { user } = useAuth();

  const sections = [
    {
      title: 'إعدادات الحساب',
      icon: Lock,
      items: [
        { 
          label: 'تغيير البريد الإلكتروني', 
          description: user?.email || 'تحديث بريدك الإلكتروني',
          onClick: () => setIsEmailModalOpen(true)
        },
        { 
          label: 'تغيير كلمة المرور', 
          description: 'تحديث كلمة المرور الخاصة بك',
          onClick: () => setIsPasswordModalOpen(true)
        },
        { label: 'المصادقة الثنائية', description: 'زيادة أمان حسابك' },
      ]
    },
    {
      title: 'إعدادات النظام',
      icon: Globe,
      items: [
        { label: 'اللغة والمنطقة', description: 'العربية (السعودية)' },
        { label: 'التنبيهات', description: 'إدارة تنبيهات البريد الإلكتروني والرسائل' },
      ]
    },
    {
      title: 'قاعدة البيانات',
      icon: Database,
      items: [
        { label: 'نسخ احتياطي', description: 'تصدير بيانات النظام' },
        { label: 'سجل العمليات', description: 'عرض سجل التغييرات في النظام' },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">الإعدادات</h1>
        <p className="text-slate-500">تخصيص النظام وتفضيلاتك</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                  <section.icon size={20} />
                </div>
                <h3 className="font-bold text-slate-900">{section.title}</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {section.items.map((item) => (
                  <button 
                    key={item.label} 
                    onClick={item.onClick}
                    className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-all text-right group"
                  >
                    <div>
                      <p className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                    <div className="text-slate-300 group-hover:text-indigo-400 transition-colors">
                      <ChevronLeft size={20} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
            <Shield size={32} className="mb-4 opacity-80" />
            <h3 className="font-bold text-lg mb-2">حالة النظام</h3>
            <p className="text-indigo-100 text-sm mb-6">جميع الأنظمة تعمل بشكل طبيعي. تم آخر فحص قبل 5 دقائق.</p>
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              متصل بقاعدة البيانات
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">حول النظام</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">الإصدار</span>
                <span className="font-mono font-medium">v1.0.4</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">آخر تحديث</span>
                <span className="font-medium">2024/05/20</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />

      <UpdateEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        currentEmail={user?.email}
      />
    </div>
  );
}
