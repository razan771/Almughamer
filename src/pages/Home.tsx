import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, ArrowLeft, BadgeCheck, HeartPulse, Pill, ShieldCheck, Sparkles, Syringe } from 'lucide-react';
import { Button } from '../components/Button';

const features = [
  { icon: ShieldCheck, title: 'أدوية موثوقة', description: 'منتجات مختارة بعناية من فئات علاجية ومكملات بيطرية عالية الجودة للهجن.' },
  { icon: HeartPulse, title: 'رعاية مستمرة', description: 'تجربة شراء واضحة تساعدك على الوصول للعلاج المناسب بسرعة وهدوء.' },
  { icon: Syringe, title: 'حلول علاجية', description: 'تصنيفات عملية للأدوية والفيتامينات ومنتجات العناية بهجن السباق.' },
  { icon: Pill, title: 'مكملات احترافية', description: 'دعم يومي للصحة والطاقة والمناعة والتحمل للهجن في مختلف مراحل الرعاية.' },
];

export function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(47,128,255,0.2),transparent_28rem),radial-gradient(circle_at_82%_45%,rgba(244,197,66,0.16),transparent_22rem)]" />

        <div className="text-center lg:text-start">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-tertiary/30 bg-tertiary/10 px-4 py-2 text-sm font-bold text-tertiary">
            <Sparkles size={16} />
            صيدلية المغامر الفضي
          </div>
          <h1 className="text-balance font-display text-4xl font-black leading-[1.25] text-on-surface sm:text-5xl lg:text-7xl">
            رعاية بيطرية فاخرة
            <span className="block text-gradient-primary">لهجنك بكل ثقة</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-on-surface-variant sm:text-lg lg:mx-0">
            المغامر الفضي يقدم تجربة تسوق بيطرية حديثة، توفر الأدوية والمكملات الأساسية للهجن، مع واجهة سهلة الاستخدام وخدمة واضحة وسريعة.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <NavLink to="/pharmacy">
              <Button className="px-8 py-4 text-base sm:text-lg">
                تصفح المنتجات
                <ArrowLeft size={20} className="mr-2" />
              </Button>
            </NavLink>
            <NavLink to="/login">
              <Button variant="secondary" className="px-8 py-4 text-base sm:text-lg">
                انضم إلينا
              </Button>
            </NavLink>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[540px]">
          <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-primary/25 via-transparent to-tertiary/20 blur-2xl" />
          <div className="luxury-panel relative overflow-hidden rounded-[38px] p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-10">
                <div className="overflow-hidden rounded-[30px] border border-white/10">
                  <img src="/images/hero-camel.png" alt="رعاية بيطرية للهجن" className="h-64 w-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
                <div className="rounded-[28px] bg-primary/15 p-5 shadow-blue-glow">
                  <Activity className="mb-3 text-tertiary" size={28} />
                  <p className="text-sm font-bold leading-7 text-on-surface">متابعة صحية ومنتجات جاهزة للطلب.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-[28px] bg-tertiary p-5 text-on-tertiary shadow-gold">
                  <BadgeCheck className="mb-3" size={30} />
                  <p className="font-display text-2xl font-black">اختيار دقيق</p>
                  <p className="mt-2 text-sm font-bold opacity-80">للأدوية والمكملات البيطرية.</p>
                </div>
                <div className="overflow-hidden rounded-[30px] border border-white/10">
                  <img src="/images/camel-hero.png" alt="هجن ورعاية بيطرية" className="h-72 w-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(feature => (
            <div key={feature.title} className="group rounded-[30px] border border-white/10 bg-surface-container-lowest/70 p-6 shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-blue-glow">
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-tertiary transition-transform duration-300 group-hover:scale-110">
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-black">{feature.title}</h3>
              <p className="mt-3 leading-7 text-on-surface-variant">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="luxury-panel grid items-center gap-8 rounded-[36px] p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div className="overflow-hidden rounded-[30px]">
            <img src="/images/hero-camel.png" alt="أدوية ورعاية بيطرية للهجن" className="h-72 w-full object-cover sm:h-96" />
          </div>
          <div>
            <p className="mb-3 text-sm font-black text-tertiary">منصة بروح بيطرية</p>
            <h2 className="text-balance text-3xl font-black leading-[1.35] sm:text-5xl">
              علاجات بيطرية ومكملات مختارة لهجن السباق.
            </h2>
            <p className="mt-5 leading-8 text-on-surface-variant">
              المغامر الفضي هو صيدلية بيطرية متخصصة تقدم حلولاً علاجية ومكملات مختارة بعناية للرعاية البيطرية اليومية، مع تجربة شراء سريعة وواضحة.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
