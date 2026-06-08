'use client';

import type React from 'react';
import { useFormStatus } from 'react-dom';
import {
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
} from 'react-icons/hi2';
import { cn } from '@/utils';

type Tone = 'info' | 'success' | 'error';

const toneStyles: Record<Tone, string> = {
  info: 'border-[#BFDBFE] bg-[#EFF6FF] text-[#1E40AF]',
  success: 'border-green-200 bg-green-50 text-green-700',
  error: 'border-red-200 bg-red-50 text-red-700',
};

const toneIcons = {
  info: HiOutlineInformationCircle,
  success: HiOutlineCheckCircle,
  error: HiOutlineExclamationTriangle,
};

export function Notice({
  tone = 'info',
  title,
  children,
}: {
  tone?: Tone;
  title: string;
  children?: React.ReactNode;
}) {
  const Icon = toneIcons[tone];

  return (
    <div className={cn('rounded-md border px-4 py-3', toneStyles[tone])} role={tone === 'error' ? 'alert' : 'status'}>
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-sm font-bold">{title}</p>
          {children && <div className="mt-1 text-sm leading-6 opacity-90">{children}</div>}
        </div>
      </div>
    </div>
  );
}

export function SubmitButton({
  children,
  pendingText = 'جاري الحفظ...',
  className,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        'inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#0369A1] px-6 text-sm font-bold text-white transition duration-200 hover:bg-[#003652] focus:outline-none focus:ring-2 focus:ring-[#C29C41] disabled:cursor-wait disabled:opacity-75',
        className,
      )}
    >
      {pending && <HiOutlineArrowPath className="h-5 w-5 animate-spin" />}
      {pending ? pendingText : children}
    </button>
  );
}

export function FormBusyOverlay({
  title = 'جاري حفظ التغييرات',
  detail = 'قد يستغرق رفع الملفات الكبيرة بضع ثوان. لا تغلق الصفحة.',
}: {
  title?: string;
  detail?: string;
}) {
  const { pending } = useFormStatus();

  if (!pending) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0A2540]/45 px-4 backdrop-blur-sm" role="status" aria-live="polite">
      <div className="w-full max-w-sm rounded-lg border border-[#D9E3EE] bg-white p-5 text-center shadow-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F0F7FC] text-[#0369A1]">
          <HiOutlineArrowPath className="h-6 w-6 animate-spin" />
        </div>
        <p className="mt-4 text-base font-bold text-[#003652]">{title}</p>
        <p className="mt-2 text-sm leading-6 text-[#64748B]">{detail}</p>
      </div>
    </div>
  );
}

export function FileField({
  name,
  accept,
  label,
  hint,
  multiple = false,
}: {
  name: string;
  accept: string;
  label: string;
  hint: string;
  multiple?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="block">
      <span className="mb-2 block text-sm font-bold text-[#334155]">{label}</span>
      <input
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={pending}
        className="block w-full cursor-pointer rounded-md border border-[#CBD5E1] bg-white text-sm text-[#475569] file:ml-3 file:cursor-pointer file:border-0 file:bg-[#0369A1] file:px-4 file:py-2.5 file:font-bold file:text-white disabled:cursor-wait disabled:opacity-70"
      />
      <p className="mt-2 text-xs leading-5 text-[#64748B]">{hint}</p>
    </div>
  );
}
