'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold outline-none transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#C29C41] focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'border border-[#C29C41] bg-gradient-to-b from-[#e8c96a] to-[#C29C41] text-[#0A2540] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_22px_rgba(194,156,65,0.22)] hover:brightness-110',
        navy: 'bg-gradient-to-br from-[#022A4E] to-[#034582] text-white shadow-[0_8px_20px_rgba(2,42,78,0.24)] hover:brightness-125',
        outline:
          'border border-[#C29C41]/45 bg-white/60 text-[#8B681C] hover:border-[#C29C41] hover:bg-[#FFF8E8] hover:text-[#0A2540]',
        ghost: 'text-[#0369A1] hover:bg-[#0369A1]/8 hover:text-[#022A4E]',
        subtle:
          'border border-[#0369A1]/14 bg-white text-[#0A2540] shadow-sm hover:border-[#C29C41]/50 hover:bg-[#FFF8E8]',
        link: 'text-[#0369A1] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5 has-[>svg]:px-4',
        sm: 'h-8 gap-1.5 px-3.5 text-xs has-[>svg]:px-3',
        lg: 'h-12 px-8',
        icon: 'size-10 rounded-xl',
        'icon-sm': 'size-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
