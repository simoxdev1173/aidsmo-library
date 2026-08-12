import * as React from 'react';
import { cn } from '@/utils/cn';

function Field({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field"
      className={cn('group/field grid gap-2', className)}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot="field-label"
      className={cn('ps-1 text-sm font-bold leading-none text-[#0B4E84] group-has-[[aria-invalid=true]]/field:text-red-700', className)}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-description"
      className={cn('ps-1 text-xs leading-5 text-[#64748B]', className)}
      {...props}
    />
  );
}

function FieldError({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-error"
      role="alert"
      className={cn('ps-1 text-xs font-semibold leading-5 text-red-700', className)}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-group"
      className={cn('grid gap-5', className)}
      {...props}
    />
  );
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel };
