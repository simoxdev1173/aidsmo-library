'use client';

import { useState } from 'react';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Comment = {
  id: string;
  name: string;
  initials: string;
  body: string;
  time: string;
};

/**
 * Placeholder discussion thread. There is no comments table or public-user
 * system in this app yet, so this is a hardcoded demo: the seed comments are
 * fixed, and anything a visitor adds only lives in this component's state
 * for the current page view, not in a database.
 */
const SEED_COMMENTS: Comment[] = [
  {
    id: 'seed-1',
    name: 'خالد المنصوري',
    initials: 'خم',
    body: 'مرجع مفيد جدا، هل تتوفر نسخة أحدث تغطي التطورات الأخيرة في هذا المجال؟',
    time: 'قبل 3 أسابيع',
  },
  {
    id: 'seed-2',
    name: 'سارة العبدالله',
    initials: 'سع',
    body: 'استخدمت هذا المدخل كمرجع في دراسة سابقة، المحتوى موثق بشكل جيد.',
    time: 'قبل شهر',
  },
  {
    id: 'seed-3',
    name: 'يوسف الفهد',
    initials: 'يف',
    body: 'شكرا للمنظمة على إتاحة هذه الإصدارات رقميا، تسهل الوصول للباحثين كثيرا.',
    time: 'قبل شهرين',
  },
];

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((part) => part[0]);
  return letters.join('') || 'ز';
}

export default function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>(SEED_COMMENTS);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedBody = body.trim();
    if (!trimmedName || !trimmedBody) return;

    setComments((current) => [
      {
        id: `local-${Date.now()}`,
        name: trimmedName,
        initials: initialsOf(trimmedName),
        body: trimmedBody,
        time: 'الآن',
      },
      ...current,
    ]);
    setName('');
    setBody('');
  };

  return (
    <div className="mt-16 overflow-hidden rounded-[24px] border border-[#0369A1]/14 bg-[#F0F7FC] p-6 shadow-[0_18px_48px_rgba(10,37,64,0.08)] md:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#022A4E] text-[#E8C96A]">
          <HiOutlineChatBubbleLeftRight className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-[#003652]">التعليقات</h2>
          <p className="text-xs font-bold text-[#0369A1]">
            {comments.length} {comments.length === 1 ? 'تعليق' : 'تعليقات'}
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-start">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="الاسم"
          className="border-[#E3EAF3] sm:w-44"
        />
        <Textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="اكتب تعليقك..."
          rows={1}
          className="flex-1 rounded-2xl border border-[#E3EAF3] bg-white px-4 py-3 focus-visible:border-[#C29C41] focus-visible:ring-[3px] focus-visible:ring-[#C29C41]/18"
        />
        <Button type="submit" disabled={!name.trim() || !body.trim()}>
          نشر
        </Button>
      </form>

      <ul className="mt-6 flex flex-col divide-y divide-[#0369A1]/10">
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#022A4E] text-xs font-bold text-[#E8C96A]">
              {comment.initials}
            </span>
            <div className="min-w-0 flex-1 rounded-2xl bg-white/70 px-4 py-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="text-sm font-bold text-[#0A2540]">{comment.name}</p>
                <span className="text-xs font-semibold text-[#0369A1]/70">{comment.time}</span>
              </div>
              <p className="mt-1 text-sm leading-6 text-[#334155]">{comment.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
