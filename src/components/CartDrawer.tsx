import React from 'react';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { Button } from './Button';
import type { Product } from './ProductCard';

interface CartItem extends Product {
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onCheckout: () => void;
}

export function CartDrawer({ isOpen, onClose, items, onRemoveItem, onUpdateQuantity, onCheckout }: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-md transition-opacity" onClick={onClose} />
      )}

      <aside className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md transform flex-col border-l border-white/10 bg-surface-container-lowest/95 shadow-ambient backdrop-blur-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <p className="text-sm font-bold text-tertiary">المغامر الفضي</p>
            <h2 className="text-2xl font-black">سلة المشتريات</h2>
          </div>
          <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-2xl bg-white/8 text-on-surface-variant transition-colors hover:bg-error/15 hover:text-error">
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 text-center text-on-surface-variant">
              <p className="text-lg font-bold">السلة فارغة</p>
              <p className="mt-2 text-sm">أضف منتجاً من الصيدلية لإتمام الطلب.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
                <div className="flex gap-4">
                  <img src={item.image} alt={item.name} className="h-20 w-20 flex-shrink-0 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h4 className="line-clamp-2 font-display font-bold leading-6">{item.name}</h4>
                    <p className="mt-1 font-display text-lg font-black text-tertiary">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-white/10 bg-background/40">
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-white/10 disabled:opacity-40">
                      <Minus size={15} />
                    </button>
                    <span className="min-w-8 text-center text-sm font-black">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-white/10">
                      <Plus size={15} />
                    </button>
                  </div>
                  <button onClick={() => onRemoveItem(item.id)} className="grid h-10 w-10 place-items-center rounded-2xl text-on-surface-variant transition-colors hover:bg-error/15 hover:text-error">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/10 bg-surface/80 p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-bold text-on-surface-variant">المجموع الفرعي</span>
              <span className="font-display text-3xl font-black text-tertiary">${subtotal.toFixed(2)}</span>
            </div>
            <Button fullWidth variant="primary" className="py-4 text-lg" onClick={onCheckout}>
              إتمام الشراء
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
