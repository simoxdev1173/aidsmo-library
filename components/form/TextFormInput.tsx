'use client';
import { cn } from '@/utils';
import { InputHTMLAttributes, ReactNode } from 'react';

interface TextFormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  fullWidth?: boolean;
  error?: string;
  endButton?: ReactNode;
  containerClassName?: string;
}

const TextFormInput = ({
  name,
  label,
  fullWidth,
  error,
  endButton,
  className,
  containerClassName,
  ...props
}: TextFormInputProps) => {
  return (
    <div className={cn('relative', fullWidth && 'w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-[#334155]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          className={cn(
            'rounded-md border border-[#e2e8f0] bg-white px-4 py-2 text-[#334155] placeholder:text-[#94a3b8] focus:border-[#0369a1] focus:outline-none focus:ring-1 focus:ring-[#0369a1]',
            fullWidth && 'w-full',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {endButton}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TextFormInput;