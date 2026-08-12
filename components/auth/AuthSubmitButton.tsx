'use client';

import { useFormStatus } from 'react-dom';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';

export default function AuthSubmitButton({
  children,
  pendingText,
}: {
  children: React.ReactNode;
  pendingText: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending && <HiOutlineArrowPath className="h-4 w-4 animate-spin" />}
      {pending ? pendingText : children}
    </Button>
  );
}
