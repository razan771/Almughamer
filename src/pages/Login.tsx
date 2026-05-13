import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { Button } from '../components/Button';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.login(email, password);
      if (res.success) {
        login(res.token, res.user);
        navigate(res.user.role === 'admin' ? '/admin' : '/profile');
      } else {
        alert(res.message || 'تسجيل الدخول غير صحيح');
      }
    } catch {
      alert('تعذر الاتصال بالخادم');
    }
  };

  return (
    <div className="flex min-h-[72vh] items-center justify-center px-4 py-12">
      <div className="luxury-panel w-full max-w-md rounded-[34px] p-7 sm:p-8">
        <p className="mb-2 text-center text-sm font-black text-tertiary">المغامر</p>
        <h2 className="mb-7 text-center text-3xl font-black">تسجيل الدخول</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <label className="relative">
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
            <input required type="text" placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-background/50 py-3 pl-4 pr-12 outline-none transition-colors focus:border-tertiary" />
          </label>
          <label className="relative">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
            <input required type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-background/50 py-3 pl-4 pr-12 outline-none transition-colors focus:border-tertiary" />
          </label>
          <Button type="submit" fullWidth className="mt-2 text-lg">دخول</Button>
        </form>
        <p className="mt-6 text-center text-sm font-bold text-on-surface-variant">
          ليس لديك حساب؟ <Link to="/register" className="text-tertiary hover:underline">مستخدم جديد</Link>
        </p>
      </div>
    </div>
  );
}
