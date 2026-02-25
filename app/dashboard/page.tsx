'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Smartphone, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp,
  Clock,
  Car
} from 'lucide-react';
import { motion } from 'motion/react';
import { differenceInDays, parseISO } from 'date-fns';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalDevices: 0,
    expiringSoon: 0,
    activeSubscriptions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [customersRes, devicesRes] = await Promise.all([
        supabase.from('customers').select('id', { count: 'exact' }),
        supabase.from('devices').select('*')
      ]);

      const devices = devicesRes.data || [];
      const today = new Date();
      
      const expiringSoon = devices.filter(d => {
        const simDays = differenceInDays(parseISO(d.sim_expiry), today);
        const annualDays = differenceInDays(parseISO(d.annual_expiry), today);
        return simDays < 30 || annualDays < 30;
      }).length;

      setStats({
        totalCustomers: customersRes.count || 0,
        totalDevices: devices.length,
        expiringSoon,
        activeSubscriptions: devices.length - expiringSoon
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'إجمالي العملاء', value: stats.totalCustomers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'إجمالي الأجهزة', value: stats.totalDevices, icon: Smartphone, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'اشتراكات تنتهي قريباً', value: stats.expiringSoon, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'اشتراكات نشطة', value: stats.activeSubscriptions, icon: CheckCircle2, color: 'text-sky-600', bg: 'bg-sky-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">نظرة عامة</h1>
        <p className="text-slate-500">مرحباً بك في لوحة التحكم الخاصة بك</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={card.title}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon size={24} />
              </div>
              <TrendingUp size={16} className="text-slate-300" />
            </div>
            <p className="text-slate-500 text-sm font-medium">{card.title}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {loading ? '...' : card.value}
            </h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity or Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-900">النشاط الأخير</h3>
            <button className="text-indigo-600 text-sm font-medium hover:underline">عرض الكل</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Clock size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">تم إضافة جهاز جديد للمركبة &quot;تويوتا كامري&quot;</p>
                  <p className="text-xs text-slate-500">منذ ساعتين</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg text-slate-900 mb-6">إجراءات سريعة</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all text-right">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Users size={18} />
              </div>
              <span className="text-sm font-medium">إضافة عميل جديد</span>
            </button>
            <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all text-right">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Car size={18} />
              </div>
              <span className="text-sm font-medium">إضافة مركبة جديدة</span>
            </button>
            <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all text-right">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <AlertCircle size={18} />
              </div>
              <span className="text-sm font-medium">مراجعة الاشتراكات المنتهية</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
