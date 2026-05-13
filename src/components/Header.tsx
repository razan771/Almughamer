import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Menu, ShieldPlus, ShoppingCart, Sparkles, User, X } from 'lucide-react';
import { useAuth } from '../AuthContext';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

export function Header({ cartCount, onOpenCart }: HeaderProps) {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 lg:text-base ${
      isActive
        ? 'bg-primary/15 text-tertiary shadow-blue-glow'
        : 'text-on-surface-variant hover:bg-white/8 hover:text-on-surface'
    }`;

  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <div className="mx-auto max-w-7xl">
        <div className="glass flex min-h-20 items-center justify-between rounded-[28px] px-4 shadow-ambient sm:px-6">
          <NavLink to="/" onClick={() => setIsMenuOpen(false)} className="group flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-tertiary text-on-tertiary shadow-gold transition-transform duration-300 group-hover:scale-105">
              <ShieldPlus size={27} />
            </span>
            <span className="leading-none">
              <span className="block font-display text-3xl font-black text-gradient-primary sm:text-4xl">المغامر</span>
              <span className="mt-1 hidden text-xs font-bold text-on-surface-variant sm:block">صيدلية أدوية بيطرية</span>
            </span>
          </NavLink>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={linkClass}>
              <Home size={18} />
              الرئيسية
            </NavLink>
            <NavLink to="/pharmacy" className={linkClass}>
              <Sparkles size={18} />
              الصيدلية
            </NavLink>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <NavLink
                to={user.role === 'admin' ? '/admin' : '/profile'}
                className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-on-surface-variant transition-all duration-300 hover:border-primary/40 hover:text-on-surface md:flex"
              >
                <User size={18} />
                <span className="line-clamp-1">{user.name}</span>
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-on-surface-variant transition-all duration-300 hover:border-primary/40 hover:text-on-surface md:flex"
              >
                <User size={18} />
                تسجيل الدخول
              </NavLink>
            )}

            <button
              onClick={onOpenCart}
              className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white/8 text-on-surface transition-all duration-300 hover:bg-tertiary hover:text-on-tertiary hover:shadow-gold focus:outline-none"
              aria-label="فتح السلة"
            >
              <ShoppingCart size={21} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-background bg-primary text-[11px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(open => !open)}
              className="grid h-11 w-11 place-items-center rounded-2xl bg-white/8 text-on-surface transition-colors md:hidden"
              aria-label="فتح القائمة"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="glass mt-3 rounded-[24px] p-3 shadow-ambient md:hidden">
            <nav className="flex flex-col gap-2">
              <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={linkClass}>
                <Home size={18} />
                الرئيسية
              </NavLink>
              <NavLink to="/pharmacy" onClick={() => setIsMenuOpen(false)} className={linkClass}>
                <Sparkles size={18} />
                الصيدلية
              </NavLink>
              <NavLink
                to={user ? (user.role === 'admin' ? '/admin' : '/profile') : '/login'}
                onClick={() => setIsMenuOpen(false)}
                className={linkClass}
              >
                <User size={18} />
                {user ? user.name : 'تسجيل الدخول'}
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
