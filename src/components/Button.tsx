import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', fullWidth, className = '', children, ...props }: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-body font-bold transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-tertiary text-on-tertiary rounded-2xl px-6 py-3 shadow-gold hover:-translate-y-1 hover:bg-[#ffd45f] hover:shadow-[0_0_42px_rgba(244,197,66,0.48)]',
    secondary: 'bg-white/8 text-on-surface border border-white/10 rounded-2xl px-6 py-3 shadow-soft backdrop-blur hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/15',
    tertiary: 'text-tertiary hover:bg-tertiary/10 rounded-2xl px-4 py-2 hover:-translate-y-0.5',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
