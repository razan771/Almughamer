import React from 'react';
import { MapPin, MessageCircle, Phone, Send, Share2, ShieldPlus } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-surface/70 px-4 py-12 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-tertiary text-on-tertiary shadow-gold">
              <ShieldPlus size={26} />
            </span>
            <div>
              <h2 className="font-display text-3xl font-black text-gradient-primary">المغامر الفضي</h2>
              <p className="text-sm font-bold text-on-surface-variant">صيدلية أدوية بيطرية للهجن</p>
            </div>
          </div>
          <p className="max-w-md leading-8 text-on-surface-variant">
            حلول علاجية ومكملات مختارة بعناية لرعاية الهجن، مع تجربة شراء سريعة وواضحة.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-black">روابط سريعة</h3>
          <div className="grid gap-3 text-on-surface-variant">
            <a href="/" className="transition-colors hover:text-tertiary">الرئيسية</a>
            <a href="/pharmacy" className="transition-colors hover:text-tertiary">الصيدلية</a>
            <a href="/login" className="transition-colors hover:text-tertiary">حسابي</a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-black">تواصل معنا</h3>
          <div className="grid gap-3 text-on-surface-variant">
            <span className="flex items-center gap-2"><Phone size={17} /> +971 52 692 0801</span>
            <span className="flex items-center gap-2"><MapPin size={17} /> الإمارات العربية المتحدة</span>
          </div>
          <div className="mt-5 flex gap-3">
            {[MessageCircle, Send, Share2].map((Icon, index) => (
              <a key={index} href="#" className="grid h-10 w-10 place-items-center rounded-2xl bg-white/8 text-on-surface transition-all hover:bg-tertiary hover:text-on-tertiary hover:shadow-gold">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
