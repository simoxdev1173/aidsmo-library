'use client';

import * as React from 'react';

import { cn } from '@/utils/cn';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'field-sizing-content flex min-h-11 w-full resize-none rounded-xl bg-transparent px-1 py-2.5 text-sm leading-relaxed text-[#0A2540] outline-none transition-colors placeholder:text-[#0A2540]/40 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
