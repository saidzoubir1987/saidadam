'use client';

import React, { useEffect, useState } from 'react';
import { supabase, Device, Customer } from '@/lib/supabase';
import { 
  Plus, 
  Search, 
  RotateCcw, 
  Trash2, 
  Car, 
  Smartphone, 
  Calendar,
  Filter,
  MoreVertical,
  X
} from 'lucide-react';
import { differenceInDays, parseISO, addYears, format } from 'date-fns';
import { ar } from 'date-fns/locale';
import CircularProgress from '@/components/CircularProgress';
import ConfirmationModal from '@/components/ConfirmationModal';
import { motion, AnimatePresence } from 'motion/react';

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    vehicle: '',
    imei: '',
    sim: '',
    customer_id: '',
    sim_expiry: format(addYears(new Date(), 1), 'yyyy-MM-dd'),
    annual_expiry: format(addYears(new Date(), 1), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [devicesRes, customersRes] = await Promise.all([
        supabase.from('devices').select('*').order('created_at', { ascending: false }),
        supabase.from('customers').select('*').order('name')
      ]);

      if (devicesRes.error) throw devicesRes.error;
      if (customersRes.error) throw customersRes.error;

      setDevices(devicesRes.data || []);
      setCustomers(customersRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('devices').insert([formData]);
      if (error) throw error;
      setIsAddModalOpen(false);
      fetchData();
      setFormData({
        name: '',
        vehicle: '',
        imei: '',
        sim: '',
        customer_id: '',
        sim_expiry: format(addYears(new Date(), 1), 'yyyy-MM-dd'),
        annual_expiry: format(addYears(new Date(), 1), 'yyyy-MM-dd'),
      });
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

  const handleReset = async () => {
    if (!selectedDevice) return;
    try {
      const newExpiry = format(addYears(new Date(), 1), 'yyyy-MM-dd');
      const { error } = await supabase
        .from('devices')
        .update({ 
          sim_expiry: newExpiry, 
          annual_expiry: newExpiry 
        })
        .eq('id', selectedDevice.id);

      if (error) throw error;
      setIsResetModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error resetting device:', error);
    }
  };

  const calculateProgress = (expiryDate: string) => {
    const today = new Date();
    const expiry = parseISO(expiryDate);
    const daysLeft = differenceInDays(expiry, today);
    const totalDays = 365;
    const progress = Math.max(0, Math.min(100, (daysLeft / totalDays) * 100));
    return { progress, daysLeft };
  };

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.imei.includes(searchTerm) ||
    d.sim.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة الأجهزة</h1>
          <p className="text-slate-500">تتبع الأجهزة والاشتراكات والعملاء</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm shadow-indigo-200"
        >
          <Plus size={20} />
          إضافة جهاز جديد
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="بحث بالاسم، المركبة، IMEI أو رقم الشريحة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
          <Filter size={18} />
          تصفية
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">الاسم</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">المركبة</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">IMEI</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">رقم الشريحة</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">عداد الشريحة</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">جاري التحميل...</td>
                </tr>
              ) : filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">لا توجد أجهزة مطابقة للبحث</td>
                </tr>
              ) : (
                filteredDevices.map((device) => {
                  const simInfo = calculateProgress(device.sim_expiry);
                  const annualInfo = calculateProgress(device.annual_expiry);
                  
                  return (
                    <tr key={device.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Smartphone size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{device.name}</p>
                            <p className="text-xs text-slate-500">
                              {customers.find(c => c.id === device.customer_id)?.name || 'بدون عميل'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Car size={16} className="text-slate-400" />
                          <span>{device.vehicle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">{device.imei}</td>
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">{device.sim}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-bold",
                            simInfo.daysLeft > 30 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                          )}>
                            {simInfo.daysLeft} يوم
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-6">
                          <div className="flex gap-4">
                            <CircularProgress 
                              value={simInfo.progress} 
                              label={`شريحة: ${simInfo.daysLeft} يوم`} 
                              color={simInfo.daysLeft > 30 ? "stroke-emerald-500" : "stroke-red-500"}
                            />
                            <CircularProgress 
                              value={annualInfo.progress} 
                              label={`سنوي: ${annualInfo.daysLeft} يوم`} 
                              color={annualInfo.daysLeft > 30 ? "stroke-indigo-500" : "stroke-amber-500"}
                            />
                          </div>
                          <button 
                            onClick={() => {
                              setSelectedDevice(device);
                              setIsResetModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="تجديد الاشتراك"
                          >
                            <RotateCcw size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Device Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">إضافة جهاز جديد</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddDevice} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">اسم الجهاز</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="مثال: جهاز تتبع 1"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">المركبة</label>
                    <input
                      required
                      value={formData.vehicle}
                      onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="مثال: تويوتا كامري 2023"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">IMEI</label>
                    <input
                      required
                      value={formData.imei}
                      onChange={(e) => setFormData({...formData, imei: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="رقم IMEI المكون من 15 خانة"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">رقم الشريحة</label>
                    <input
                      required
                      value={formData.sim}
                      onChange={(e) => setFormData({...formData, sim: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="رقم شريحة البيانات"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">العميل</label>
                    <select
                      required
                      value={formData.customer_id}
                      onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="">اختر عميلاً...</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">تاريخ انتهاء الشريحة</label>
                    <input
                      type="date"
                      required
                      value={formData.sim_expiry}
                      onChange={(e) => setFormData({...formData, sim_expiry: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    إضافة الجهاز
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleReset}
        title="تجديد الاشتراك"
        message="هل أنت متأكد من رغبتك في تجديد اشتراك هذا الجهاز لمدة عام كامل؟ سيتم تحديث تاريخ انتهاء الشريحة والاشتراك السنوي."
      />
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
