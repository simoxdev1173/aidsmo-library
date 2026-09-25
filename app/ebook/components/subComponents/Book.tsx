'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import styles from './Book.module.css';

interface BookProps {
  title: string;
  openLabel: string;
  closeLabel: string;
  content: React.ReactNode;
  cover: React.ReactNode;
  backOfCover?: React.ReactNode;
  color?: string;
  rtl?: boolean;
}

export function Book({ title, openLabel, closeLabel, content, cover, backOfCover, color = '#0a2540', rtl = false }: BookProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <button
      type="button"
      className={styles.trigger}
      dir={rtl ? 'rtl' : 'ltr'}
      aria-label={`${open ? closeLabel : openLabel}: ${title}`}
      aria-expanded={open}
      onClick={() => setOpen((current) => !current)}
      onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}
    >
      <motion.span className={styles.book} aria-hidden="true"
        initial={false}
        animate={{ rotateY: open ? 0 : rtl ? 12 : -12, x: open ? (rtl ? '-37%' : '37%') : '0%', scale: open ? 0.74 : 1, y: open ? -4 : 0 }}
        whileHover={open || reduceMotion ? undefined : { y: -7, rotateY: rtl ? 6 : -6 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
        <span className={styles.back} style={{ backgroundColor: color }} />
        <span className={styles.pages}>{content}<motion.span className={styles.pageShadow} initial={false} animate={{ opacity: open ? 0 : 0.45 }} transition={{ duration: reduceMotion ? 0 : 0.9 }} /></span>
        <span className={styles.pageEdges} />
        <span className={styles.spine} style={{ backgroundColor: color }} />
        <motion.span
          className={styles.cover}
          style={{ transformOrigin: rtl ? 'right center' : 'left center' }}
          initial={false}
          animate={{ rotateY: open ? (rtl ? 176 : -176) : 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 1.05, ease: [0.32, 0.05, 0.18, 1], delay: open ? 0.06 : 0 }}
        >
          <span className={styles.coverFront}>{cover}</span>
          <span className={styles.coverInside}>{backOfCover}</span>
        </motion.span>
      </motion.span>
      <span className={styles.hint} aria-hidden="true">{open ? closeLabel : openLabel}<span>{open ? '−' : '+'}</span></span>
    </button>
  );
}
