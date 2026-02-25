import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-2xl border border-brand-700/20 bg-white/80 px-4 text-sm text-brand-900 shadow-sm outline-none transition focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/30',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
