'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary: 'bg-accent text-surface font-semibold hover:bg-accent/90 active:scale-95',
  secondary: 'bg-surface-2 text-white border border-surface-3 hover:bg-surface-3 active:scale-95',
  ghost: 'text-accent/80 hover:text-accent hover:bg-surface-2 active:scale-95',
  danger: 'bg-red-900/40 text-red-400 border border-red-900 hover:bg-red-900/60 active:scale-95',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 transition-all duration-150 select-none',
          variants[variant],
          sizes[size],
          disabled && 'opacity-40 cursor-not-allowed active:scale-100',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
