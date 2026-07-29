'use client';

import * as React from 'react';

import { cn } from '@/utils/cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-13 w-full min-w-0 rounded-2xl border border-[#D9E3EE] bg-white px-4 text-sm font-semibold text-[#0A2540] shadow-[0_1px_2px_rgba(10,37,64,0.04)] outline-none transition duration-200',
        'placeholder:font-medium placeholder:text-[#94A3B8]',
        'hover:border-[#C29C41]/55',
        'focus-visible:border-[#C29C41] focus-visible:ring-[3px] focus-visible:ring-[#C29C41]/18',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
