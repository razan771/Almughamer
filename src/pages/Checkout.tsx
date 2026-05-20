import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import type { Product } from '../components/ProductCard';
import { config } from '../config';
import { formatCurrency } from '../utils/currency';

interface CheckoutProps {
  items: (Product & { quantity: number })[];
  clearCart: () => void;
}

export function Checkout({ items, clearCart }: CheckoutProps) {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleWhatsAppCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('السلة فارغة');
      return;
    }
    if (!customerName || !customerPhone) {
      alert('يرجى إدخال الاسم ورقم التواصل');
      return;
    }

    try {
      if (token) await api.checkout(items, total, 'whatsapp', token);
    } catch {
      console.error('Failed to save order to backend');
    }

    const message = `السلام عليكم، أريد طلباً من متجر المغامر الفضي:\n\nالمنتجات:\n` +
      items.map(item => `- ${item.name} x ${item.quantity} = ${formatCurrency(item.price * item.quantity)}`).join('\n') +
      `\n\nالمجموع: ${formatCurrency(total)}\n\n` +
      `الاسم: ${customerName}\n` +
      `رقم التواصل: ${customerPhone}\n` +
      `العنوان: ${customerAddress}`;

    window.open(`https://wa.me/${config.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    clearCart();
    navigate('/');
  };

  if (!user || items.length === 0) {
    return (
      <div className="px-4 py-24 text-center">
        <h2 className="text-2xl font-black">السلة فارغة أو لم يتم تسجيل الدخول</h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center md:text-start">
        <p className="text-sm font-black text-tertiary">خطوة أخيرة</p>
        <h1 className="mt-2 text-4xl font-black">إتمام الشراء</h1>
      </div>

      <div className="luxury-panel rounded-[34px] p-6 md:p-8">
        <div className="mb-8 border-b border-white/10 pb-8">
          <h2 className="mb-5 text-2xl font-black">ملخص الطلب</h2>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.04] p-4">
                <span className="text-sm font-bold md:text-base">{item.name} x {item.quantity}</span>
                <span className="font-display font-black text-tertiary">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between text-xl font-black">
            <span>الإجمالي</span>
            <span className="text-tertiary">{formatCurrency(total)}</span>
          </div>
        </div>

        <form onSubmit={handleWhatsAppCheckout} className="space-y-6">
          <h2 className="text-2xl font-black">بيانات التوصيل</h2>

          <div className="grid gap-4">
            <label className="grid gap-2 font-bold">
              الاسم الكامل *
              <input required type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="rounded-2xl border border-white/10 bg-background/50 px-4 py-3 outline-none transition-colors focus:border-tertiary" placeholder="الاسم الكامل" />
            </label>
            <label className="grid gap-2 font-bold">
              رقم التواصل *
              <input required type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="rounded-2xl border border-white/10 bg-background/50 px-4 py-3 text-end outline-none transition-colors focus:border-tertiary" placeholder="0501234567" />
            </label>
            <label className="grid gap-2 font-bold">
              العنوان التفصيلي
              <textarea value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="min-h-[110px] rounded-2xl border border-white/10 bg-background/50 px-4 py-3 outline-none transition-colors focus:border-tertiary" placeholder="المدينة، الحي، الشارع..." />
            </label>
          </div>

          <button type="submit" className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] py-4 text-base font-black text-white shadow-[0_0_32px_rgba(37,211,102,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#20bd5a] md:text-lg">
            <MessageCircle size={22} />
            إتمام الطلب عبر واتساب
          </button>
        </form>
      </div>
    </div>
  );
}
