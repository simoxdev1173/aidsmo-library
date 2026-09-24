'use client';

import { HiOutlineArrowLeft, HiOutlineBookOpen } from 'react-icons/hi2';
import ChatbotPromptButton from '@/components/ChatbotPromptButton';
import type { DocumentChatContext } from '@/lib/document-chat';
import styles from './BookReading.module.css';

// Add breathing room to long prose without changing its wording or punctuation.
function readingParagraphs(text: string) {
  return text.trim().split(/\n\s*\n/u).flatMap((block) => {
    if (block.split(/\s+/u).length < 85 || block.includes('\n')) return [block];
    const sentences = block.split(/(?<=[.!?؟])\s+/u);
    const paragraphs: string[] = [];
    let current = '';
    for (const sentence of sentences) {
      current = current ? `${current} ${sentence}` : sentence;
      if (current.split(/\s+/u).length >= 55) {
        paragraphs.push(current);
        current = '';
      }
    }
    if (current) paragraphs.push(current);
    return paragraphs;
  });
}

export default function BookSummary({ text, source, title, documentContext }: {
  text: string;
  source: 'editorial' | 'generated' | 'metadata';
  title: string;
  documentContext?: DocumentChatContext;
}) {
  const paragraphs = readingParagraphs(text);

  return (
    <article id="book-summary" className={styles.summary} aria-labelledby="book-summary-heading">
      <header className={styles.summaryHeader}>
        <div>
          <p className={styles.eyebrow}><HiOutlineBookOpen aria-hidden="true" /> قبل أن تبدأ القراءة</p>
          <h2 id="book-summary-heading" className={styles.summaryTitle}>{source === 'metadata' ? 'نبذة عن الإصدار' : 'ملخص الوثيقة'}</h2>
        </div>
      </header>
      <div className={styles.prose}>
        {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      {source === 'generated' && <p className={styles.sourceNote}>ملخص بمساعدة الذكاء الاصطناعي، مستند إلى صفحات مختارة من الوثيقة. راجع الأصل للتفاصيل.</p>}
      {source === 'metadata' && <p className={styles.sourceNote}>نبذة مستندة إلى بيانات الفهرسة المتاحة.</p>}
      <section className={styles.questions} aria-labelledby="book-questions-heading">
        <div className={styles.questionsHeader}>
          <h3 id="book-questions-heading">{documentContext ? 'تعمّق في الوثيقة' : 'واصل الاستكشاف'}</h3>
          <p>{documentContext ? 'اختر سؤالاً لعرض الإجابة مع الصفحات الداعمة.' : 'اسأل المساعد الذكي عن هذا الإصدار.'}</p>
        </div>
        {documentContext ? (
          <div className={styles.questionGrid}>
            {documentContext.questions.map((item) => (
              <ChatbotPromptButton key={item.question} prompt={item.question} documentContext={documentContext} autoAnswer className={styles.question}>
                <span>{item.question}</span><HiOutlineArrowLeft aria-hidden="true" />
              </ChatbotPromptButton>
            ))}
          </div>
        ) : (
          <ChatbotPromptButton prompt={`أخبرني عن إصدار «${title}»`} className={styles.askButton}>اسأل عن هذا الإصدار<HiOutlineArrowLeft aria-hidden="true" /></ChatbotPromptButton>
        )}
      </section>
    </article>
  );
}
