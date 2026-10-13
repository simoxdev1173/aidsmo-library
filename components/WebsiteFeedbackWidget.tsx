'use client';

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import { HiCheck, HiOutlineArrowLeft, HiOutlineChatBubbleLeftRight, HiOutlineClock, HiOutlineStar, HiOutlineXMark, HiStar } from 'react-icons/hi2';
import { submitWebsiteFeedback, type WebsiteFeedbackInput } from '@/lib/website-feedback-actions';
import styles from './WebsiteFeedbackWidget.module.css';

const questions = [
  { key: 'experience', title: 'كيف تقيّم تجربتك العامة في الموقع؟' },
  { key: 'performance', title: 'ما مدى سرعة تحميل الصفحات والكتب؟' },
  { key: 'navigation', title: 'ما مدى سهولة العثور على الكتب والمعلومات؟' },
  { key: 'readability', title: 'ما مدى وضوح التصميم وسهولة قراءة المحتوى؟' },
] as const;

type AnswerKey = (typeof questions)[number]['key'];
type Answers = Record<AnswerKey, number | null>;

const emptyAnswers: Answers = {
  experience: null,
  performance: null,
  navigation: null,
  readability: null,
};

const ratingLabels = ['ضعيف جداً', 'ضعيف', 'مقبول', 'جيد', 'ممتاز'];

export default function WebsiteFeedbackWidget({ initiallyOpen = false }: { initiallyOpen?: boolean }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [openedAt, setOpenedAt] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) {
        triggerRef.current?.focus();
        document.body.style.overflow = '';
      }
      wasOpenRef.current = false;
      return;
    }

    wasOpenRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    headingRef.current?.focus();

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), textarea:not(:disabled), [href], input:not(:disabled)',
      )).filter((element) => element.tabIndex >= 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && (document.activeElement === first || document.activeElement === headingRef.current)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === headingRef.current)) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isComplete) headingRef.current?.focus();
  }, [isComplete]);

  function openSurvey() {
    if (isComplete) {
      setIsComplete(false);
      setHasStarted(false);
      setStep(0);
      setAnswers(emptyAnswers);
      setComment('');
    }
    setErrorMessage('');
    setOpenedAt(Date.now());
    setIsOpen(true);
  }

  function handleDialogClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) setIsOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setErrorMessage('');

    const input: WebsiteFeedbackInput = {
      experience: answers.experience ?? 0,
      performance: answers.performance ?? 0,
      navigation: answers.navigation ?? 0,
      readability: answers.readability ?? 0,
      comment,
      pagePath: pathname || '/',
      elapsedMs: Math.max(0, Date.now() - openedAt),
      website: new FormData(event.currentTarget).get('website')?.toString() ?? '',
    };

    setIsSubmitting(true);
    try {
      const result = await submitWebsiteFeedback(input);
      if (result.ok) {
        setIsComplete(true);
      } else {
        setErrorMessage(result.message);
      }
    } catch {
      setErrorMessage('تعذر إرسال رأيك الآن. حاول مرة أخرى بعد قليل.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const isCommentStep = step === questions.length;
  const currentQuestion = questions[step];
  const currentAnswer = currentQuestion ? answers[currentQuestion.key] : null;
  const visibleRating = hoveredRating ?? currentAnswer ?? 0;
  const progress = isComplete ? 100 : ((step + 1) / (questions.length + 1)) * 100;

  return (
    <>
      <div dir="rtl" className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-40 sm:bottom-6 sm:left-6">
        <button
          ref={triggerRef}
          type="button"
          onClick={openSurvey}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label="شاركنا رأيك في الموقع"
          className="group inline-flex size-12 cursor-pointer items-center justify-center gap-2.5 rounded-full border border-[#C29C41]/70 bg-white/95 text-sm font-bold text-[#082F50] shadow-[0_10px_28px_rgba(8,47,80,0.14)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-[#C29C41] hover:shadow-[0_14px_34px_rgba(8,47,80,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:h-12 sm:w-auto sm:px-4"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-[#FBF7EA] text-[#987523] transition-colors group-hover:bg-[#F4E8C5]">
            <HiOutlineChatBubbleLeftRight className="size-[18px]" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">رأيك يهمنا</span>
        </button>
      </div>

      {isOpen && (
        <div
          className={`fixed inset-0 z-[140] flex items-end justify-center bg-[#061A2A]/55 p-0 backdrop-blur-[3px] sm:items-center sm:p-5 ${styles.backdrop}`}
          onMouseDown={handleDialogClick}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            aria-describedby={hasStarted && !isComplete ? undefined : 'feedback-description'}
            dir="rtl"
            className={`relative max-h-[min(90dvh,760px)] w-full max-w-[520px] overflow-x-hidden overflow-y-auto rounded-t-[26px] border border-white/70 bg-[#FFFEFA] p-5 text-[#082F50] shadow-[0_28px_100px_rgba(1,18,33,0.35)] sm:rounded-[26px] sm:p-7 ${styles.dialog}`}
          >
            <div className="absolute inset-x-8 top-0 h-[3px] rounded-full bg-gradient-to-l from-[#0B5688] via-[#E8C96A] to-[#C29C41]" aria-hidden="true" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-[0.65rem] font-bold tracking-[0.16em] text-[#9B7626]">ملاحظاتكم تصنع الفرق</p>
                <h2 id="feedback-title" ref={headingRef} tabIndex={-1} className="mt-2 font-academic text-2xl font-bold leading-tight text-[#053D69] focus:outline-none sm:text-[1.7rem]">
                  {isComplete ? 'شكراً لمشاركتك' : hasStarted ? 'ساعدنا على تحسين الموقع' : 'شاركنا رأيك'}
                </h2>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="إغلاق الاستبيان" className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#DCE6EF] bg-white text-[#526276] transition hover:border-[#C29C41] hover:text-[#082F50] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41]">
                <HiOutlineXMark className="size-5" aria-hidden="true" />
              </button>
            </div>

            {(!hasStarted || isComplete) && (
              <p id="feedback-description" className="mt-3 max-w-[42ch] text-sm leading-7 text-[#586779]">
                {isComplete
                  ? 'تم تسجيل رأيك بنجاح. تساعدنا ملاحظاتك على تطوير تجربة المكتبة الرقمية.'
                  : 'سيستغرق هذا الاستبيان نحو دقيقتين من وقتك.'}
              </p>
            )}

            {!isComplete ? (
              hasStarted ? <>
                <div className="mt-6" aria-label={`التقدم في الاستبيان: ${step + 1} من ${questions.length + 1}`}>
                  <div className="mb-2 flex items-center justify-between text-xs font-bold text-[#667488]">
                    <span>{isCommentStep ? 'ملاحظة أخيرة' : `السؤال ${step + 1} من ${questions.length}`}</span>
                    <span>{Math.round(progress)}٪</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#E7EDF2]">
                    <div className="h-full rounded-full bg-gradient-to-l from-[#C29C41] to-[#E8C96A] transition-[width] duration-300 ease-out" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6" key={step}>
                  <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden" />
                  <div className={styles.step} aria-live="polite" aria-atomic="true">
                    {isCommentStep ? (
                      <>
                        <label htmlFor="feedback-comment" className="block font-academic text-lg font-bold leading-8 text-[#123B56]">
                          هل لديك اقتراح أو ملاحظة تساعدنا على تحسين الموقع؟
                        </label>
                        <textarea
                          id="feedback-comment"
                          value={comment}
                          onChange={(event) => setComment(event.target.value.slice(0, 1200))}
                          maxLength={1200}
                          rows={4}
                          placeholder="اكتب اقتراحك هنا..."
                          className="mt-4 w-full resize-y rounded-2xl border border-[#D9E2EA] bg-white px-4 py-3 text-sm leading-7 text-[#082F50] placeholder:text-[#98A3B0] focus:border-[#B99135] focus:outline-none focus:ring-4 focus:ring-[#C29C41]/15"
                        />
                        <p className="mt-1 text-end text-xs text-[#7B8795]">{comment.length} / 1200</p>
                      </>
                    ) : currentQuestion ? (
                      <>
                        <h3 className="font-academic text-lg font-bold leading-8 text-[#123B56]">{currentQuestion.title}</h3>
                        <div className="mt-5 flex items-center justify-center gap-2" role="group" aria-label="اختر تقييماً من نجمة إلى خمس نجوم" onMouseLeave={() => setHoveredRating(null)}>
                          {ratingLabels.map((label, index) => {
                            const value = index + 1;
                            const selected = currentAnswer === value;
                            const filled = value <= visibleRating;
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setAnswers((previous) => ({ ...previous, [currentQuestion.key]: value }))}
                                onMouseEnter={() => setHoveredRating(value)}
                                aria-label={`${value} ${value === 1 ? 'نجمة' : 'نجوم'}: ${label}`}
                                aria-pressed={selected}
                                className="grid size-12 cursor-pointer place-items-center rounded-xl text-[#C29C41] transition duration-150 hover:bg-[#FBF7EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5688] focus-visible:ring-offset-2 motion-reduce:transition-none"
                              >
                                {filled
                                  ? <HiStar className="size-8 text-[#D1A83D] drop-shadow-[0_2px_3px_rgba(162,126,48,0.2)]" aria-hidden="true" />
                                  : <HiOutlineStar className="size-8 text-[#B58D36]" aria-hidden="true" />}
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-2 flex justify-between text-xs font-semibold text-[#718093]" dir="rtl">
                          <span dir="rtl">ضعيف جداً</span>
                          <span dir="rtl">ممتاز</span>
                        </div>
                      </>
                    ) : null}
                  </div>

                  <div className="mt-7 flex items-center justify-between gap-3 border-t border-[#E8EDF1] pt-5">
                    {step > 0 ? (
                      <button type="button" onClick={() => { setErrorMessage(''); setHoveredRating(null); setStep((current) => current - 1); }} className="min-h-11 cursor-pointer rounded-full px-4 text-sm font-bold text-[#637185] transition hover:bg-[#F1F5F8] hover:text-[#082F50] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41]">
                        السابق
                      </button>
                    ) : <span />}

                    {isCommentStep ? (
                      <button type="submit" disabled={isSubmitting} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#B58D36] bg-gradient-to-b from-[#F1DDA0] to-[#C29C41] px-6 text-sm font-bold text-[#082F50] shadow-[0_7px_18px_rgba(194,156,65,0.22)] transition duration-200 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5688] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-65">
                        {isSubmitting ? 'جارٍ الإرسال…' : 'إرسال رأيي'}
                      </button>
                    ) : (
                      <button type="button" disabled={!currentAnswer} onClick={() => { setErrorMessage(''); setHoveredRating(null); setStep((current) => current + 1); }} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#053D69] px-6 text-sm font-bold text-white shadow-[0_7px_18px_rgba(10,58,88,0.18)] transition duration-200 hover:bg-[#0B5688] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40">
                        التالي
                      </button>
                    )}
                  </div>
                  {errorMessage && <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm leading-6 text-red-800">{errorMessage}</p>}
                </form>
              </> : (
                <div className={`mt-7 rounded-[20px] border border-[#E2E8EF] bg-white p-5 shadow-[0_12px_32px_rgba(8,47,80,0.06)] sm:p-6 ${styles.intro}`}>
                  <span className="flex size-12 items-center justify-center rounded-2xl border border-[#C29C41]/30 bg-[#FBF7EA] text-[#987523]">
                    <HiOutlineClock className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-academic text-lg font-bold text-[#123B56]">استبيان قصير لتحسين تجربتك</h3>
                  <p className="mt-2 text-sm leading-7 text-[#586779]">أجب عن أربعة أسئلة سريعة، ويمكنك إضافة اقتراح في النهاية. لن يستغرق الأمر أكثر من دقيقتين.</p>
                  <button type="button" onClick={() => { setOpenedAt(Date.now()); setHasStarted(true); }} className="mt-5 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#B58D36] bg-gradient-to-b from-[#F1DDA0] to-[#C29C41] px-6 text-sm font-bold text-[#082F50] shadow-[0_7px_18px_rgba(194,156,65,0.22)] transition duration-200 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5688] focus-visible:ring-offset-2">
                    ابدأ الاستبيان <HiOutlineArrowLeft className="size-4" aria-hidden="true" />
                  </button>
                </div>
              )
            ) : (
              <div role="status" aria-live="polite" className={`py-7 text-center ${styles.success}`}>
                <span className={`mx-auto flex size-[76px] items-center justify-center rounded-full border border-[#C29C41]/45 bg-[#FBF7EA] text-[#8B681C] ${styles.successIcon}`}>
                  <HiCheck className="size-9" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-academic text-xl font-bold text-[#053D69]">وصلنا رأيك، شكراً لك</h3>
                <p className="mx-auto mt-2 max-w-[36ch] text-sm leading-7 text-[#586779]">كل إجابة تساعدنا على جعل التصفح والقراءة أسهل للجميع.</p>
                <button type="button" onClick={() => setIsOpen(false)} className="mt-6 min-h-11 cursor-pointer rounded-full bg-[#053D69] px-6 text-sm font-bold text-white transition hover:bg-[#0B5688] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29C41] focus-visible:ring-offset-2">إغلاق</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
