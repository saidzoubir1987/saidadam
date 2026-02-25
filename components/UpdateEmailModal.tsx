'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, X, CheckCircle2, AlertCircle } from 'lucide-react';

type UpdateEmailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentEmail?: string;
};

export default function UpdateEmailModal({ isOpen, onClose, currentEmail }: UpdateEmailModalProps) {
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (newEmail === currentEmail) {
      setError('البريد الإلكتروني الجديد هو نفسه الحالي');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;
      
      setSuccess(true);
      setNewEmail('');
      // Note: Supabase usually sends a confirmation link to the new email
    } catch (err: any) {
      setError(err.message || 'فشل تحديث البريد الإلكتروني');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">تغيير البريد الإلكتروني</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateEmail} className="p-6 space-y-6">
              {success ? (
                <div className="py-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">تم إرسال طلب التغيير</h4>
                  <p className="text-slate-500 px-4">
                    يرجى التحقق من بريدك الإلكتروني الجديد لتأكيد التغيير. قد تحتاج أيضاً لتأكيد الطلب من بريدك الحالي.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
                  >
                    إغلاق
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 text-amber-700 text-sm">
                    <AlertCircle size={20} className="shrink-0" />
                    <p>سيتم إرسال رابط تأكيد إلى البريد الإلكتروني الجديد. لن يتغير البريد حتى يتم التأكيد.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">البريد الإلكتروني الجديد</label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="email"
                        required
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="example@new.com"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {loading ? 'جاري الإرسال...' : 'تحديث البريد'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
