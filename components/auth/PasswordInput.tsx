'use client';

import * as React from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';

export default function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, 'type'>) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? 'text' : 'password'}
        dir="ltr"
        className={cn('pe-12 text-start', className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
        aria-pressed={visible}
        className="absolute end-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl text-[#64748B] transition hover:bg-[#F0F7FC] hover:text-[#0369A1] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
      >
        {visible ? <LuEyeOff className="size-4.5" /> : <LuEye className="size-4.5" />}
      </button>
    </div>
  );
}
