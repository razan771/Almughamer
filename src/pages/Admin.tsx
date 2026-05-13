import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Edit2, Package, Trash2 } from 'lucide-react';
import { api } from '../api';
import type { Product } from '../components/ProductCard';
import { Button } from '../components/Button';
import { useAuth } from '../AuthContext';

type Order = {
  id: number;
  created_at: string;
  payment_method: string;
  user_name: string;
  user_email: string;
  total: number;
  status: string;
  items: unknown[];
};

export function Admin() {
  const { user, token, login, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [forPet, setForPet] = useState('');

  const loadProducts = async () => {
    setProducts(await api.getProducts());
  };

  const loadOrders = async () => {
    if (token) setOrders(await api.getAdminOrders(token));
  };

  useEffect(() => {
    if (user?.role === 'admin' && token) {
      api.getProducts().then(setProducts).catch(console.error);
      api.getAdminOrders(token).then(setOrders).catch(console.error);
    }
  }, [user, token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.login(username, password);
    if (res.success && res.user.role === 'admin') {
      login(res.token, res.user);
    } else {
      alert('تسجيل الدخول غير صحيح أو الحساب ليس إدارياً');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setImage('');
    setDescription('');
    setCategory('');
    setForPet('');
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const payload = { name, price: parseFloat(price), image, description, category, forPet };
    if (editingProduct) await api.updateProduct(editingProduct, payload, token);
    else await api.addProduct(payload, token);

    handleCancelEdit();
    loadProducts();
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p.id);
    setName(p.name);
    setPrice(String(p.price));
    setImage(p.image);
    setDescription(p.description);
    setCategory(p.category);
    setForPet(p.forPet);
    document.querySelector('.sticky')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (confirm('هل أنت متأكد من حذف المنتج؟')) {
      await api.deleteProduct(id, token);
      loadProducts();
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    if (!token) return;
    await api.updateOrderStatus(id, status, token);
    loadOrders();
  };

  if (!user || user.role !== 'admin' || !token) {
    return (
      <div className="flex min-h-[72vh] items-center justify-center px-4 py-12">
        <div className="luxury-panel w-full max-w-md rounded-[34px] p-8">
          <h2 className="mb-7 text-center text-3xl font-black">دخول الإدارة</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input type="text" placeholder="اسم المستخدم" className="rounded-2xl border border-white/10 bg-background/50 px-4 py-3 text-end outline-none focus:border-tertiary" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="كلمة المرور" className="rounded-2xl border border-white/10 bg-background/50 px-4 py-3 text-end outline-none focus:border-tertiary" value={password} onChange={e => setPassword(e.target.value)} />
            <Button type="submit" fullWidth className="mt-2 text-lg">دخول</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-black text-tertiary">المغامر</p>
          <h1 className="mt-2 text-4xl font-black">لوحة تحكم الإدارة</h1>
        </div>
        <Button variant="secondary" onClick={handleLogout}>تسجيل الخروج</Button>
      </div>

      <div className="mb-8 flex gap-3">
        <Button variant={activeTab === 'products' ? 'primary' : 'tertiary'} onClick={() => setActiveTab('products')}>المنتجات</Button>
        <Button variant={activeTab === 'orders' ? 'primary' : 'tertiary'} onClick={() => setActiveTab('orders')}>الطلبات الجديدة</Button>
      </div>

      {activeTab === 'products' ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="luxury-panel sticky top-28 rounded-[30px] p-6">
              <h3 className="mb-6 text-2xl font-black">{editingProduct ? 'تحديث المنتج' : 'إضافة منتج جديد'}</h3>
              <form onSubmit={handleSubmitProduct} className="flex flex-col gap-4">
                <input required type="text" placeholder="اسم المنتج" value={name} onChange={e => setName(e.target.value)} className="rounded-2xl border border-white/10 bg-background/50 px-4 py-3 outline-none focus:border-tertiary" />
                <input required type="number" step="0.01" placeholder="السعر ($)" value={price} onChange={e => setPrice(e.target.value)} className="rounded-2xl border border-white/10 bg-background/50 px-4 py-3 outline-none focus:border-tertiary" />
                <input required type="text" placeholder="رابط الصورة" value={image} onChange={e => setImage(e.target.value)} className="rounded-2xl border border-white/10 bg-background/50 px-4 py-3 outline-none focus:border-tertiary" />
                <input required type="text" placeholder="الفئة" value={category} onChange={e => setCategory(e.target.value)} className="rounded-2xl border border-white/10 bg-background/50 px-4 py-3 outline-none focus:border-tertiary" />
                <input required type="text" placeholder="مخصص لـ" value={forPet} onChange={e => setForPet(e.target.value)} className="rounded-2xl border border-white/10 bg-background/50 px-4 py-3 outline-none focus:border-tertiary" />
                <textarea required placeholder="الوصف" value={description} onChange={e => setDescription(e.target.value)} className="min-h-[100px] rounded-2xl border border-white/10 bg-background/50 px-4 py-3 outline-none focus:border-tertiary" />
                <div className="flex gap-2">
                  <Button type="submit" className="mt-2 flex-1">{editingProduct ? 'تحديث' : 'إضافة'}</Button>
                  {editingProduct && <Button type="button" variant="secondary" className="mt-2 flex-1" onClick={handleCancelEdit}>إلغاء</Button>}
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="luxury-panel overflow-x-auto rounded-[30px]">
              <table className="w-full min-w-[680px] text-start">
                <thead className="bg-white/[0.04]">
                  <tr>
                    <th className="px-6 py-4 text-start font-black text-on-surface-variant">المنتج</th>
                    <th className="px-6 py-4 text-start font-black text-on-surface-variant">السعر</th>
                    <th className="px-6 py-4 text-start font-black text-on-surface-variant">الفئة</th>
                    <th className="px-6 py-4 text-start font-black text-on-surface-variant">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={p.image} className="h-12 w-12 rounded-2xl object-cover" alt="" />
                          <span className="font-bold">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-tertiary">${p.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-on-surface-variant">{p.category}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(p)} className="rounded-2xl p-2 text-primary transition-colors hover:bg-primary/10"><Edit2 size={20} /></button>
                          <button onClick={() => handleDelete(p.id)} className="rounded-2xl p-2 text-error transition-colors hover:bg-error/10"><Trash2 size={20} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant">لا توجد منتجات.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="luxury-panel overflow-x-auto rounded-[30px]">
          <table className="w-full min-w-[760px] text-start">
            <thead className="bg-white/[0.04]">
              <tr>
                <th className="px-6 py-4 text-start font-black text-on-surface-variant">الطلب / التاريخ</th>
                <th className="px-6 py-4 text-start font-black text-on-surface-variant">العميل</th>
                <th className="px-6 py-4 text-start font-black text-on-surface-variant">المنتجات</th>
                <th className="px-6 py-4 text-start font-black text-on-surface-variant">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {orders.map(o => (
                <tr key={o.id}>
                  <td className="px-6 py-4">
                    <p className="font-black">#{o.id}</p>
                    <p className="mt-1 text-sm text-on-surface-variant">{new Date(o.created_at + 'Z').toLocaleString('ar')}</p>
                    <p className="mt-1 text-xs text-tertiary">{o.payment_method === 'cash_on_delivery' ? 'دفع عند الاستلام' : 'بطاقة ائتمان'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold">{o.user_name}</p>
                    <p className="text-sm text-on-surface-variant">{o.user_email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="mb-1 font-black text-tertiary">${o.total.toFixed(2)}</p>
                    <p className="text-sm">{o.items.length} عناصر</p>
                  </td>
                  <td className="px-6 py-4">
                    {o.status === 'pending' ? (
                      <button onClick={() => handleUpdateStatus(o.id, 'completed')} className="flex items-center gap-2 rounded-full bg-tertiary/15 px-3 py-2 text-sm font-black text-tertiary transition-colors hover:bg-tertiary/25">
                        <Package size={16} /> قيد المعالجة
                      </button>
                    ) : (
                      <span className="flex w-fit items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-2 text-sm font-black text-emerald-300">
                        <CheckCircle size={16} /> مكتمل
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant">لا توجد طلبات جديدة.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
