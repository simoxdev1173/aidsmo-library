'use client';

import { useEffect, useReducer } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';

type Milestone = { year: string; text: string };
type TimelineState = { activeIndex: number; elapsedMs: number; isPlaying: boolean };
type TimelineAction =
  | { type: 'tick'; deltaMs: number; duration: number; count: number }
  | { type: 'select'; index: number }
  | { type: 'toggle' };

function readingDuration(text: string) {
  return Math.min(30_000, Math.max(10_000, text.length * 40));
}

function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
  if (action.type === 'select') return { ...state, activeIndex: action.index, elapsedMs: 0 };
  if (action.type === 'toggle') return { ...state, isPlaying: !state.isPlaying };
  if (!state.isPlaying || action.count < 2) return state;

  const elapsedMs = state.elapsedMs + action.deltaMs;
  if (elapsedMs >= action.duration) {
    return { ...state, activeIndex: (state.activeIndex + 1) % action.count, elapsedMs: 0 };
  }
  return { ...state, elapsedMs };
}

export default function FoundingTimeline({ milestones }: { milestones: readonly Milestone[] }) {
  const [state, dispatch] = useReducer(timelineReducer, { activeIndex: 0, elapsedMs: 0, isPlaying: true });
  const activeMilestone = milestones[state.activeIndex];
  const duration = readingDuration(activeMilestone?.text ?? '');
  const progress = Math.min(100, (state.elapsedMs / duration) * 100);

  useEffect(() => {
    if (!state.isPlaying || milestones.length < 2) return;

    let lastTick = performance.now();
    const interval = window.setInterval(() => {
      const now = performance.now();
      dispatch({ type: 'tick', deltaMs: now - lastTick, duration, count: milestones.length });
      lastTick = now;
    }, 100);

    return () => window.clearInterval(interval);
  }, [duration, milestones.length, state.isPlaying]);

  if (!activeMilestone) return null;

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#DCE6EF] bg-white shadow-[0_18px_48px_rgba(8,47,80,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-6 bg-[#082F50] px-6 py-6 text-white sm:px-9">
        <div className="max-w-2xl">
          <span className="font-display text-xs font-bold tracking-[0.18em] text-[#E8C96A]">رحلة التأسيس</span>
          <p className="mt-2 font-academic text-lg font-bold leading-8">من أول خطوة إلى المسمى الحالي للمنظمة</p>
          <p className="mt-1 font-academic text-sm leading-7 text-white/75">اختر تاريخاً من الخط الزمني لقراءة محطته، أو تابع الانتقال التلقائي بينها.</p>
        </div>
        <button type="button" onClick={() => dispatch({ type: 'toggle' })} aria-label={state.isPlaying ? 'إيقاف الانتقال التلقائي مؤقتاً' : 'استئناف الانتقال التلقائي'} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 font-academic text-sm font-bold transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8C96A]">
          {state.isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          <span>{state.isPlaying ? 'إيقاف مؤقت' : 'متابعة'}</span>
        </button>
      </div>

      <div className="h-1 bg-[#E8C96A]/20" role="progressbar" aria-label="تقدم الوقت حتى المحطة التالية" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
        <div className="h-full bg-[#E8C96A] motion-safe:transition-[width] motion-safe:duration-100" style={{ width: `${progress}%` }} />
      </div>

      <div className="relative border-b border-[#E8EEF4] px-5 py-6 sm:px-8 lg:py-7">
        <div className="pointer-events-none absolute inset-x-12 top-[46px] hidden h-px bg-[#C29C41]/45 lg:block" aria-hidden="true" />
        <ol aria-label="تواريخ محطات التأسيس" className="relative grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3 lg:grid-cols-10">
          {milestones.map((milestone, index) => (
            <li key={milestone.year}>
              <button type="button" aria-pressed={index === state.activeIndex} aria-controls="founding-milestone-description" onClick={() => dispatch({ type: 'select', index })} className={`flex min-h-16 w-full flex-col items-center justify-center gap-2 rounded-xl border px-2 py-2 font-display text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5688] ${index === state.activeIndex ? 'border-[#C29C41]/45 bg-[#FBF7EA] text-[#053D69]' : 'border-transparent bg-white text-[#64748B] hover:border-[#DCE6EF] hover:bg-[#F8FAFC] hover:text-[#053D69]'}`}>
                <span className={`h-3.5 w-3.5 rounded-full border-[3px] ${index === state.activeIndex ? 'border-[#E8C96A] bg-[#082F50] ring-4 ring-[#E8C96A]/25' : 'border-[#A6B4B8] bg-white'}`} aria-hidden="true" />
                <span dir="ltr">{milestone.year}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <article id="founding-milestone-description" className="px-6 py-8 sm:px-9 sm:py-10">
        <p className="max-w-5xl border-r-[3px] border-[#C29C41] pr-5 whitespace-pre-line font-academic text-base leading-9 text-[#334155] md:text-lg md:leading-10">{activeMilestone.text}</p>
        <div className="mt-9 flex items-center justify-between gap-4 border-t border-[#E8EEF4] pt-5">
          <button type="button" aria-label="المحطة السابقة" title="المحطة السابقة" onClick={() => dispatch({ type: 'select', index: (state.activeIndex - 1 + milestones.length) % milestones.length })} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#DCE6EF] text-[#053D69] transition-colors hover:border-[#C29C41] hover:bg-[#FBF7EA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5688]"><ArrowRight className="h-5 w-5" aria-hidden="true" /></button>
          <button type="button" aria-label="المحطة التالية" title="المحطة التالية" onClick={() => dispatch({ type: 'select', index: (state.activeIndex + 1) % milestones.length })} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#082F50] text-white transition-colors hover:bg-[#053D69] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5688]"><ArrowLeft className="h-5 w-5" aria-hidden="true" /></button>
        </div>
      </article>
    </div>
  );
}
