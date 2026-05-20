import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Package, ShoppingBag } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { Button } from '../components/Button';

type OrderItem = {
  id: string;
  name: string;
  image: string;
  quantity: number;
};

type Order = {
  id: number;
  created_at: string;
  status: string;
  total: number;
  items: OrderItem[];
};

export function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    api.getUserOrders(token).then(setOrders).catch(console.error);
  }, [user, token, navigate]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="luxury-panel mb-8 flex flex-col justify-between gap-5 rounded-[34px] p-7 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-black text-tertiary">حساب المغامر الفضي</p>
          <h1 className="mt-2 text-3xl font-black">مرحباً، {user.name}</h1>
          <p className="mt-2 text-on-surface-variant">{user.email}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <NavLink to="/pharmacy">
            <Button className="w-full px-6 py-3 sm:w-auto">
              <ShoppingBag size={19} className="ml-2" />
              تسوق الآن
            </Button>
          </NavLink>
          <Button variant="secondary" onClick={() => { logout(); navigate('/'); }}>تسجيل الخروج</Button>
        </div>
      </div>

      <h2 className="mb-6 text-2xl font-black">سجل طلباتي</h2>

      {orders.length === 0 ? (
        <div className="rounded-[34px] border border-white/10 bg-white/[0.04] py-16 text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-on-surface-variant opacity-60" />
          <p className="text-lg text-on-surface-variant">لم تقم بأي طلبات بعد.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map(order => (
            <div key={order.id} className="overflow-hidden rounded-[30px] border border-white/10 bg-surface-container-lowest/75 shadow-soft">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/[0.04] px-6 py-4">
                <div>
                  <span className="block font-black">طلب #{order.id}</span>
                  <span className="mt-1 inline-block text-start text-sm text-on-surface-variant">{new Date(order.created_at + 'Z').toLocaleString('ar')}</span>
                </div>
                <div className="text-end">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-black ${order.status === 'completed' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-tertiary/15 text-tertiary'}`}>
                    {order.status === 'completed' ? 'مكتمل' : 'قيد المعالجة'}
                  </span>
                  <p className="mt-2 text-lg font-black text-tertiary">${order.total.toFixed(2)}</p>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {order.items.map(item => (
                    <li key={item.id} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="h-16 w-16 rounded-2xl object-cover" />
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="mt-1 text-sm text-on-surface-variant">الكمية: {item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
