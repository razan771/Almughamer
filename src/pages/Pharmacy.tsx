import React from 'react';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../components/ProductCard';
import { Search, ShieldCheck, Sparkles } from 'lucide-react';

interface PharmacyProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function Pharmacy({ products, onAddToCart }: PharmacyProps) {
  return (
    <div className="min-h-screen px-4 pb-24 pt-14 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="luxury-panel relative overflow-hidden rounded-[36px] p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_0%,rgba(47,128,255,0.22),transparent_26rem),radial-gradient(circle_at_90%_35%,rgba(244,197,66,0.14),transparent_22rem)]" />
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-tertiary/30 bg-tertiary/10 px-4 py-2 text-sm font-bold text-tertiary">
              <Sparkles size={16} />
              منتجات بيطرية مختارة
            </div>
            <h1 className="text-balance text-4xl font-black leading-[1.25] sm:text-6xl">صيدلية المغامر</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-on-surface-variant">
              أدوية ومكملات بيطرية بتصميم واضح: الصورة، الاسم، السعر، وزر الشراء فقط لتجربة أسرع على الجوال والسطح.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <ShieldCheck className="text-tertiary" />
              <span className="font-bold text-on-surface-variant">منتجات موثوقة</span>
            </div>
            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <Search className="text-tertiary" />
              <span className="font-bold text-on-surface-variant">تصفح سريع وواضح</span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => onAddToCart(product)}
              index={index}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
