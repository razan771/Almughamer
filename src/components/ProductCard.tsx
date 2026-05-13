import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from './Button';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  forPet: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  index: number;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-white/10 bg-surface-container-lowest/78 p-3 shadow-soft backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:rotate-[0.35deg] hover:border-primary/40 hover:shadow-blue-glow">
      <div className="relative aspect-square overflow-hidden rounded-[26px] bg-surface-container">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-xl font-black leading-7 text-on-surface transition-colors group-hover:text-tertiary">
          {product.name}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="font-display text-2xl font-black text-tertiary">${product.price.toFixed(2)}</span>
          <Button variant="primary" onClick={onAddToCart} className="min-w-28 px-4 py-3 text-sm">
            <ShoppingCart size={18} className="ml-2" />
            شراء
          </Button>
        </div>
      </div>
    </article>
  );
}
