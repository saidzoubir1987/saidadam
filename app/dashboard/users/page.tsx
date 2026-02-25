'use client';

import React, { useEffect, useState } from 'react';
import { supabase, Profile } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { 
  UserPlus, 
  Shield, 
  Mail, 
  Trash2, 
  Lock,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export default function UsersPage() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchUsers();
    }
  }, [profile]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('role');
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="p-4 bg-red-50 text-red-600 rounded-full mb-4">
          <Lock size={48} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">غير مصرح لك بالدخول</h1>
        <p className="text-slate-500">هذه الصفحة مخصصة لمديري النظام فقط.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة المستخدمين</h1>
          <p className="text-slate-500">إدارة صلاحيات الوصول للنظام</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm shadow-indigo-200">
          <UserPlus size={20} />
          إضافة مستخدم جديد
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">المستخدم</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">الصلاحية</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">تاريخ الانضمام</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">جاري التحميل...</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                          <Mail size={18} />
                        </div>
                        <span className="font-medium text-slate-900">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit",
                        user.role === 'admin' ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-600"
                      )}>
                        <Shield size={12} />
                        {user.role === 'admin' ? 'مدير نظام' : 'مستخدم'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {/* Assuming created_at exists on profile or we use a placeholder */}
                      2024-01-01
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 text-amber-700">
        <AlertCircle size={20} className="shrink-0" />
        <p className="text-sm">
          تنبيه: لا يمكن إضافة مستخدمين جدد إلا من خلال لوحة تحكم Supabase أو عن طريق تفعيل التسجيل المفتوح.
        </p>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
